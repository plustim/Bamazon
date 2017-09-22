// customer interface to bamazon store

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database : "bamazon"
});

var hr = "+----+--------------------------------+-----------------+---------+-------+";
var inquirerHr = new inquirer.Separator(hr);
var titles = {
	item_id: "#",
	product_name: "Product Name",
	department_name: "Department",
	price: " Price",
	stock_quantity: "Stock"
};
   
connection.connect(function(err) {
	if (err) throw err;
	storeFront();
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

function buyItem(item){
	inquirer.prompt([
		{	
			name: "quantity",
			message: "How many "+ item.product_name + "s would you like to buy?"
		}
	]).then(function(response){
		response.quantity = parseInt(response.quantity);
		if(response.quantity <= item.stock_quantity){
			var query = connection.query("UPDATE products SET stock_quantity=stock_quantity-?, product_sales=product_sales+? WHERE item_id=?",[response.quantity, item.price*response.quantity, item.item_id],function(err, res) {
				if(err) throw err;
				var total = response.quantity * item.price;
				console.log("Your total comes out to $"+total+". Thank you for your purchase!");
				storeFront();	
			});
		}else{
			console.log("We apologize, but you cannot buy "+response.quantity+" "+item.product_name+"s as there are only "+item.stock_quantity+" left in stock.");
			buyItem(item);
		}
	});
}

function storeFront(){
	console.log("\nWhich item would you like to buy?\n")
	connection.query("SELECT * FROM products WHERE stock_quantity > 0 ORDER BY department_name", function(err, res){
		if(err) throw err;

		listAll = res.map(function(data){
			return {
				name: writeRow(data),
				value: data,
				short: "\n  "+writeRow(data)+"\n  "+hr
			};
		});
		listAll.push(
			inquirerHr,
			{
				name: "   (Exit Store)",
				value: "quit",
				short: "\n  Thank you for visiting Bamazon. Please come again!"
			},
			inquirerHr
		);

		inquirer.prompt([
			{	
				name: "item",
				type: "list",
				message: hr+"\n  "+writeRow(titles)+"\n  "+hr,
				choices: listAll
			}
		]).then(function(response){
			if( response.item == "quit"){
				connection.end();
				process.exit();
			}else{
				buyItem(response.item);
			}
		});
	});
}