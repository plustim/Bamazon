// supervisor view for Bamazon

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

var hr = "+----+-----------------+--------------+--------------+--------------+";
var titles = {
	department_id: "#",
	department_name: "Department Name",
	over_head_costs: "Overhead",
	productSales: "Total Sales",
	totalProfit: "Total Profit"
};
   
connection.connect(function(err) {
	if (err) throw err;
	console.log("\nWelcome, Supervisor!")
	superviseStore();
});

// my own function for outputting a formatted table because I want to do something a little more fancy
function writeRow(row){
	var totalSales = row.productSales || row['SUM(products.product_sales)'];
	var totalProfit = row.totalProfit || totalSales - row.over_head_costs;
	var fullRow = "| " + fillCell(row.department_id, 3) + "| " + fillCell(row.department_name, 15) + " | " + fillCell(row.over_head_costs, 12) + " | " + fillCell(totalSales, 12)+ " | " + fillCell(totalProfit, 12) + " |";
	if(totalProfit < 0){
		return fullRow.red;
	}else{
		return fullRow;
	}
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

var supervisor = {
	viewDepartments: function(){
		connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) FROM departments LEFT JOIN products ON products.department_name = departments.department_name GROUP BY departments.department_name", function(err, res){
			if(err) throw err;
			console.log(hr+"\n"+writeRow(titles)+"\n"+hr);
			res.forEach(function(data){
				console.log(writeRow(data));
			});
			console.log(hr+"\n");
			superviseStore();
		});	
	},

	addDepartment: function(){
		inquirer.prompt([
			{	
				name: "department_name",
				message: "Department Name: "
			},
			{	
				name: "over_head_costs",
				message: "Overhead: "
			}
		]).then(function(response){
			connection.query("SELECT * FROM departments WHERE department_name=?", response.department_name, function(err, resItem){
				if(err) throw err;
				if(!resItem[0]){
					var query = connection.query("INSERT INTO departments SET ?", response, function(err, res) {
						if(err) throw err;
						console.log(response.department_name+" has been added to the store.\n");
						superviseStore();	
					});
				}else{
					console.log("\""+ response.department_name +"\" department already exists.\n");
					superviseStore();
				}	
			});
			
		});
	}
};

function superviseStore(){
	inquirer.prompt([
		{	
			name: "task",
			type: "list",
			message: "What would you like to do?",
			choices: [
				{
					name: "View Product Sales by Department",
					value: "viewDepartments",
					short: "\nView Product Sales by Department"
				},
				{
					name: "Create New Department",
					value: "addDepartment",
					short: "\nCreate New Department"
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
			supervisor[response.task]();
		}
	});
}