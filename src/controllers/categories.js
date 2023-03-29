const { connection } = require("../db/db");

const getCategories = async(res) => {

  try{
    let results = await connection.promise().query("SELECT * FROM categories ORDER BY category");

    if(results[0].length === 0) {
      res.status(404).send("No resources found.");
    } else {
      res.status(200).send(results[0]);
    }
  } catch(err) {
    res.status(500).send("Internal Server Error")
    console.log(err);
  }
}

// add a custom category
const addCategory = async(category, res) => {

  try{
    let results = await connection.promise().query(`INSERT INTO categories (category) VALUES ("${category}");`)
    
    if(results[0].affectedRows) {
      res.status(200).send("Successfully added item.")
    } else {
      res.status(202).send("Request acknowledged but not processed.");
    }
    
  } catch(err) {
    res.status(500).send("Internal Server Error")
    console.log(err);
  }

} 

module.exports = { getCategories, addCategory };