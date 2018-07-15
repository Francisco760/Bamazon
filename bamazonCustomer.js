var Table = require('cli-table');
var mysql = require('mysql');
var inquirer = require('inquirer');
var wrap = require("word-wrap");
var colors = require("colors");
colors.setTheme({
    custom: ["inverse", "yellow"]
});

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    inventory();
    console.log("\r\nWelcome to Bamazon!".custom)
});

function inventory() {

    // instantiate
    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30, 30]
    });

    listInventory();

    function listInventory() {

        connection.query("SELECT * FROM products", function (err, res) {
            for (var i = 0; i < res.length; i++) {

                var itemId = res[i].item_id,
                    productName = res[i].product_name,
                    departmentName = res[i].department_name,
                    price = res[i].price,
                    stockQuantity = res[i].stock_quantity;

                table.push(
                    [itemId, productName, departmentName, price, stockQuantity]
                );
            }
            console.log("");
            console.log("");
            console.log(table.toString());
            console.log("");
            selectionPrompt();
        });
    }
}

function selectionPrompt() {

    inquirer.prompt([{

        type: "input",
        name: "inputId",
        message: "Please enter the ID number of the item you would like to purchase.",
    },
    {
        type: "input",
        name: "inputNumber",
        message: "How many units of this item would you like to purchase?",

    }
    ]).then(function (userPurchase) {

        connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function (err, res) {
            for (var i = 0; i < res.length; i++) {

                if (userPurchase.inputNumber > res[i].stock_quantity) {

                    console.log(colors.green("Sorry! \r\nNot enough in stock. Please try again later."));
                    continuePrompt();

                } else {
                    console.log(colors.bold.underline("\r\nYou've selected:"));
                    console.log("\r\nItem: " + colors.green(res[i].product_name));
                    console.log("\r\nDepartment: " + colors.green(res[i].department_name));
                    console.log("\r\nPrice: " + colors.green(res[i].price));
                    console.log("\r\nQuantity: " + colors.green(userPurchase.inputNumber));
                    console.log(colors.bold.bgWhite.red("\r\nTotal: " + res[i].price * userPurchase.inputNumber));

                    var newStock = (res[i].stock_quantity - userPurchase.inputNumber);
                    var purchaseId = (userPurchase.inputId);
                    console.log(colors.green("\r\n" + newStock + " in stock left\r\n"));
                    confirmPrompt(newStock, purchaseId);
                }
            }
        });
    });
}

function confirmPrompt(newStock, purchaseId) {

    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Would you like to place order?",
        default: true

    }]).then(function (userConfirm) {
        if (userConfirm.confirmPurchase === true) {

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            }, {
                item_id: purchaseId
            }], function (err, res) { });

            console.log(colors.green("\r\nTransaction completed. Thank you.\r\n"));

            continuePrompt();

        } else {
            console.log(colors.green("\r\nOrder cancelled.\r\n"));

            continuePrompt();
        }
    });
}

function continuePrompt() {

    inquirer.prompt([{

        type: "confirm",
        name: "continue",
        message: "Would you like to purchase an item?\r\n",
        default: true

    }]).then(function (user) {
        if (user.continue === true) {
            selectionPrompt();
        } else {
            console.log(colors.green("\r\nHave a wonderfull day, see you soon!\r\n"));
            connection.end()
        }
    });
}
