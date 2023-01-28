const { connection } = require("../db/db");

const getBooksByCategory = async(id) => {
  let response;

  try{
    let results = await connection.promise().query(
      `SELECT books.book_id, title, author, description, categories.category, status.status, reviews.rating, reviews.comment, dateAdded 
       FROM books
       INNER JOIN reviews 
       ON books.review_id = reviews.review_id
       INNER JOIN status 
       ON books.status_id = status.status_id
       INNER JOIN categories 
       ON books.category_id = categories.category_id
       WHERE books.category_id = ${id};`)
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

module.exports = { getBooksByCategory, addCategory };