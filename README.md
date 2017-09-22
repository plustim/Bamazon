# Bamazon

## Usage
### Customer View (bamazonCustomer.js)
- Let's visit the Bamazon store.
![store front](demo/1.png "Oh man, I'm gonna buy so many Furbys")
- Buy an item
![buying](demo/2.png "What? I really like Furbys.")

### Manager View (bamazonManager.js)
- Managing inventory for the Bamazon store (products in red are low)
![inventory](demo/3.png "Uh oh, Furbys are low again.")
(you can also view a separate list of only inventory that is low.)
- Add inventory
![add more](demo/4.png "Better get some more Furbys.")
- Add a new product
![add product](demo/5.png "Skip-Its seem cool with the kids this season.")
![added product](demo/6.png "I really hope these sell.")
- Adding a new product with the same name as an existing product will try to resolve the conflict
![add existing](demo/7.png "Oh, I guess we already have these.")

### Supervisor View (bamazonSupervisor.js)
- Supervising the store's sales (departments in red are losing money)
![store profits](demo/8.png "Sales are not good this season. We only sold 1 Furby.")
- Add a department
![new department](demo/9.png "I hope selling candy makes us money. We're really hurting here.") 

## To Install
1. Use the included schema.sql file to create the "bamazon" database.
- note: if a database already exists with this name, please edit these lines in schema.sql:
```
CREATE DATABASE bamazon;
USE bamazon;
```
to CREATE and USE a different name of your choice. but **remember this name!**
- Feel free to remove the INSERT statements too, if you don't want the products I've supplied.

2. Edit the files bamazonCustomer.js, bamazonManager.js, and bamazonSupervisor.js near the top where it says:
```
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database : "bamazon"
});
```
Replacing the information with your own MySQL information.  If you're running it locally, this will probably mean at least changing the password to the password for your database. (If you changed the database name in step 1, make sure you change it here too.)

3. Run
```
$ npm install
```

4. Run the js files from the terminal.

## Packages in use
- [npm colors](https://www.npmjs.com/package/colors)
- [npm mysql](https://www.npmjs.com/package/mysql)
- [npm inquirer](https://www.npmjs.com/package/inquirer)