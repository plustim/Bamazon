// manager interface to bamazon store

var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database : "bamazon"
});

var hr = "+----+--------------------------------+-----------------+---------+-------+";
var titles = {
	item_id: "#",
	product_name: "Product Name",
	department_name: "Department",
	price: " Price",
	stock_quantity: "Stock"
};
   
connection.connect(function(err) {
	if (err) throw err;
	console.log("\nWelcome, Manager!")
	manageStore();
});

// my own function for outputting a formatted table because I want to do something a little more fancy
function writeRow(row){	
	return "| " + fillCell(row.item_id, 3) + "| " + fillCell(row.product_name, 30) + " | " + fillCell(row.department_name, 15) + " | $" + fillCell(row.price, 6) + " | " + fillCell(row.stock_quantity, 5) + " |";
}

// add trailing spaces to fill out table cell
function fillCell(value, width){
	value += "";
	if(width >= value.length){
		return value + Array(width + 1 - value.length).join(" ");
	}else{
		return value.substring(0, width);
	}
}

var manager = {
	viewAll: function(){
		connection.query("SELECT * FROM products ORDER BY department_name", function(err, res){
			if(err) throw err;
			console.log(hr+"\n"+writeRow(titles)+"\n"+hr);
			res.forEach(function(data){
				if(data.stock_quantity > 5){
					console.log(writeRow(data));
				}else{
					console.log(writeRow(data).red);
				}
			});
			console.log(hr+"\n");
			manageStore();
		});	
	},

	viewLow: function(){
		connection.query("SELECT * FROM products WHERE stock_quantity <= 5 ORDER BY department_name", function(err, res){
			if(err) throw err;
			if(res[0]){
				console.log(hr+"\n"+writeRow(titles)+"\n"+hr);
				res.forEach(function(data){
					console.log(writeRow(data));
				});
				console.log(hr+"\n");
			}else{
				console.log("All inventory is currently stocked!\n");
			}
			manageStore();
		});	
	},

	addMore: function(itemID, itemQuant){
		if(itemID && itemQuant){
			itemQuant = parseInt(itemQuant);
			connection.query("SELECT product_name, stock_quantity FROM products WHERE item_id=?", itemID, function(err, resItem){
				if(err) throw err;
				if(resItem[0]){
					var query = connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [resItem[0].stock_quantity+itemQuant, itemID],function(err, res) {
						if(err) throw err;
						console.log(itemQuant+" "+resItem[0].product_name+"s have been added to the stock. The total is now "+(resItem[0].stock_quantity+itemQuant)+".");
						manageStore();	
					});
				}else{
					console.log("Unable to add stock to item. Please check if a product exists with id:"+itemID);
					manageStore();
				}	
			});
		}else{
			inquirer.prompt([
				{	
					name: "item",
					message: "Add to what product? (id) "
				},
				{	
					name: "quantity",
					message: "Add how many to stock? "
				}
			]).then(function(response){
				connection.query("SELECT product_name, stock_quantity FROM products WHERE item_id=?", response.item, function(err, resItem){
					if(err) throw err;
					if(resItem[0]){
						var query = connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [resItem[0].stock_quantity+parseInt(response.quantity), response.item],function(err, res) {
							if(err) throw err;
							console.log(response.quantity+" "+resItem[0].product_name+"s have been added to the stock. The total is now "+(resItem[0].stock_quantity+parseInt(response.quantity))+".");
							manageStore();
						});
					}else{
						console.log("Unable to add stock to item. Please check if a product exists with id:"+response.item);
						manageStore();
					}	
				});
				
			});
		}
	},

	addNew: function(){
		inquirer.prompt([
			{	
				name: "product_name",
				message: "Product Name: "
			},
			{	
				name: "department_name",
				message: "Department: "
			},
			{	
				name: "price",
				message: "Price: $"
			},
			{	
				name: "stock_quantity",
				message: "Stock: "
			}
		]).then(function(response){
			connection.query("SELECT item_id FROM products WHERE product_name=?", response.product_name, function(err, resItem){
				if(err) throw err;
				if(!resItem[0]){
					var query = connection.query("INSERT INTO products SET ?", response, function(err, res) {
						if(err) throw err;
						console.log(response.product_name+" has been added to the store.\n");
						manageStore();	
					});
				}else{
					inquirer.prompt([{
						name: "add",
						type: "list",
						message: "A product with that name already exists. Would you like to add this stock to the existing product?",
						choices: ["yes", "no"],
					}]).then(function(newResponse){
						if(newResponse.add == "yes"){
							manager.addMore(resItem[0].item_id, response.stock_quantity);
						}else{
							manageStore();
						}
					});
				}	
			});
			
		});
	}
};

function manageStore(){
	inquirer.prompt([
		{	
			name: "task",
			type: "list",
			message: "What would you like to do?",
			choices: [
				{
					name: "View Products for Sale",
					value: "viewAll",
					short: "\nView Products for Sale"
				},
				{
					name: "View Low Inventory",
					value: "viewLow",
					short: "\nView Low Inventory"
				},
				{
					name: "Add to Inventory",
					value: "addMore",
					short: "\nAdd to Inventory"
				},
				{
					name: "Add New Product",
					value: "addNew",
					short: "\nAdd New Product"
				},
				{
					name: "Quit",
					value: "quit",
					short: "\nGoodbye!"
				}
			]
		}
	]).then(function(response){
		if( response.task == "quit"){
			connection.end();
			process.exit();
		}else{
			manager[response.task]();
		}
	});
}