DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
	item_id INT(10) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30),
	department_name VARCHAR(15),
	price DECIMAL(6,2),
	stock_quantity INT(5),
	product_sales DECIMAL(10,2) DEFAULT 0,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments(
	department_id INT(10) AUTO_INCREMENT NOT NULL,
	department_name VARCHAR(15),
	over_head_costs DECIMAL(6,2),
    PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("GameBoy", "Electronics", 129.99, 60),
("PlayStation", "Electronics", 110.99, 26),
("Yo-Yo", "Toys", 19.99, 100),
("Easy Bake Oven", "Toys", 95.99, 50),
("Furby", "Toys", 39.99, 5),
("Pokemon Card Booster", "Toys", 7.99, 7),
("T-Shirt", "Apparel", 10.99, 25),
("Pants", "Apparel", 25.75, 30),
("Tube Socks", "Apparel", 8.99, 43),
("Tamagotchi", "Toys", 19.99, 50);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Electronics", 1000),
("Toys", 600),
("Apparel", 400);