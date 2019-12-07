// Creating a variable gives us access to an object.
const mysql = require("mysql");
const inquirer = require("inquirer");

require("dotenv").config();

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "bamazon"
})

// With the connect method we are creating a channel to the database.
// We want to use the channel, but then free the channel up for someone else to use.
connection.connect(function (err) {
    if (err) {
        throw err;
    }
    // Debugging
    // console.log("Connected as ID:", connection.threadId);

    connection.query("SELECT * FROM products", function (err, results) {
        if (err) {
            throw err;
        }
        for (let i = 0; i < results.length; i++) {
            console.log("Item ID:", results[i].item_id);
            console.log("Product:", results[i].product_name);
            // console.log("Department:", results[i].department_name);
            console.log("Price: $", results[i].price_for_customer);
            // console.log("Stock Quantity:", results[i].stock_quantity);
            console.log("----------------------------------------------------");
        }
        inquirer.prompt([
            {
                name: "id",
                message: "What is the ID of the product that you would like to buy?"
            },
            {
                name: "units",
                message: "How much of the product would you like to buy?"
            }
        ]).then(function (answers) {

            // Debugging
            // console.log("Results:", results);
            // console.log("Answer ID", answers.id);
            // console.log("Results Answer's ID:", results[answers.id - 1]);
            let index = 0;
            if ((answers.id - 1) > 0){
                index = answers.id - 1;
            } 
            setTimeout(run, 1000);
            function run() {
                if (answers.units < results[index].stock_quantity) {
                    let stock = results[index].stock_quantity - answers.units;
    
                    // Debugging
                    // console.log("Answer Units:", answers.units);
                    // console.log("Stock:", stock);
    
                    console.log("There is currently", results[index].stock_quantity, "of those items in stock.");
                    console.log("Updating the database to reflect your order...");
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: stock
                            },
                            {
                                item_id: answers.id
                            }
                        ],
                        function (err, res) {
                            if (err) throw err;
                            console.log("Database updated!");
                            connection.query("SELECT price_for_customer FROM products WHERE ?", { item_id: answers.id }, function (err, res) {
                                if (err) throw err;

                                // Debugging
                                // console.log("Results:", results);
                                console.log("You owe", answers.units * res[0].price_for_customer, "dollars.");

                                console.log("There is now", stock, "of those items in stock.");
                            });
                            connection.end();
                        }    
                    );  
                }
                else {
                    console.log("Insufficient quantity! We only have", results[index].stock_quantity, "in stock.");
                    connection.end();
                }
            } 
        });
        // console.log(results);
        
    });
});