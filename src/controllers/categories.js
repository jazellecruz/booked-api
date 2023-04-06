const { connection } = require("../db/db");

const getCategories = async(res) => {

  try{
    let results = await connection.promise().query("SELECT * FROM categories ORDER BY category");

    if(!results[0].length) {
      res.status(404).send("No resources found.");
    } else {
      res.status(200).send(results[0]);
    }
  } catch(err) {
    res.sendStatus(500);
    console.log(err);
  }
}

// add a custom category
const addCategory = async(category, res) => {

  try{
    let results = await connection.promise().query(`INSERT INTO categories (category) VALUES ("${category}");`)
    
    if(!results[0].affectedRows) {
      res.status(202).send("Request acknowledged but not processed.");
    } else {
      res.status(200).send("Successfully added item.");
    }
    
  } catch(err) {
    res.sendStatus(500);
    console.log(err)
  }

} 

module.exports = { getCategories, addCategory };