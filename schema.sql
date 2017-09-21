DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
	item_id INT(10) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30),
	department_name VARCHAR(20),
	price DECIMAL(6,2),
	stock_quantity INT(5),
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("GameBoy", "Electronics", 129.99, 6),
("Yo-Yo", "Toys", 19.99, 100),
("Easy Bake Oven", "Toys", 95.99, 50),
("Pokemon Card Booster", "Toys", 7.99, 7);

SELECT * FROM products;