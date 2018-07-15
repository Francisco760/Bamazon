DROP DATABASE IF EXISTS bamazon_db;
CREATE database bamazon_db;
USE bamazon_db;
CREATE TABLE products
(
    item_id INTEGER(10)
    AUTO_INCREMENT NOT NULL,
    product_name VARCHAR
    (100) NOT NULL,
    department_name VARCHAR
    (100) NULL,
    price DECIMAL
    (10,2) NOT NULL,
    stock_quantity INTEGER
    (100) NULL,
    PRIMARY KEY
    (item_id)
);
    INSERT INTO products
        (item_id, product_name, department_name, price, stock_quantity)
    VALUES("1", "Nintendo Switch", "Video Games", 299.99, 95);
    INSERT INTO products
        (item_id, product_name, department_name, price, stock_quantity)
    VALUES("2", "iPhone X", "Cell Phones", 999.99, 90);
    INSERT INTO products
        (item_id, product_name, department_name, price, stock_quantity)
    VALUES("3", "Echo Dot", "Electronics", 35.99, 99);
    INSERT INTO products
        (item_id, product_name, department_name, price, stock_quantity)
    VALUES("4", "Taste of the Wild", "Pet Supplies", 48.99, 93);
    INSERT INTO products
        (item_id, product_name, department_name, price, stock_quantity)
    VALUES("5", "GoPro HERO5 Black", "Electronics", 299.99, 97);
      

    