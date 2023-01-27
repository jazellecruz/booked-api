const { connection } = require("../db/db");

const getCategories = async () => {
  let response;
  try{
    let results = await connection.promise().query("SELECT * FROM categories")
    response = results[0]
  } catch(err) {
    throw err
  }
  console.log(response)
  return response
}

module.exports = { getCategories };