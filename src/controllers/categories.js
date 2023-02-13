const { connection } = require("../db/db");

const getCategories = async() => {
  let response;

  try{
    let results = await connection.promise().query("SELECT * FROM categories")
    response = results[0]
    console.log(response)
  } catch(err) {
    throw err;
  }
  return response;
}

const getBooksByCategory = async(id) => {
  let response;

  try{
    let results = await connection.promise().query(
      `(SELECT books.book_id, title, author, description, categories.category, status.status, reviews.rating, reviews.comment, dateAdded 
       FROM books
       INNER JOIN reviews 
       ON books.review_id = reviews.review_id
       INNER JOIN status 
       ON books.status_id = status.status_id
       INNER JOIN categories 
       ON books.category_id = categories.category_id
       WHERE books.category_id = ${id});
       (SELECT category FROM categories WHERE category_id = ${id});`)
      
    // the result sent is contained in an array that is inside in an another array
    // to access it directly, is shifted and pop from its parent array
    let books = results[0].shift();
    let category = results[0].pop();

    response = {
      books: [...books],
      // just spread the object since it has the same key name
      ...category[0]
    }
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

module.exports = { getCategories, getBooksByCategory, addCategory };