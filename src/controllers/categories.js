const { connection } = require("../db/db");

const getCategories = async() => {
  let response;

  try{
    let results = await connection.promise().query("SELECT * FROM categories")
    response = results[0]
  } catch(err) {
    throw err;
  }
  return response;
}

// add a custom category
const addCategory = async(category) => {
  let response;

  try{
    let results = await connection.promise().query(`INSERT INTO categories (category) VALUES ("${category}");`)
    response = results[0]
  } catch(err) {
    throw err;
  }
  return response;
} 

module.exports = { getCategories, addCategory };