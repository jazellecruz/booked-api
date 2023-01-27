const { connection } = require("../db/db");

const getBooks = async() => {
  let response;
  try{
    let results = await connection.promise().query(
      `SELECT book_id, title, author, categories.category, status.status, dateAdded FROM books 
       JOIN categories ON books.category_id = categories.category_id 
       JOIN status ON books.status_id = status.status_id;`)
    response = results[0]
  } catch(err) {
    throw err;
  }
  return response
}

const addBook = async(book) => {
  let response;
  let { title, author, category_id, status_id } = book
  try{
    let results = await connection.promise().query(
      `INSERT INTO books (title, author, category_id, status_id, dateAdded) 
      VALUES ("${title}", "${author}", ${category_id}, ${status_id}, curdate());`)
    response = results[0]
  } catch(err) {
    throw err;
  }
  return response
}

const deleteBook = async(id) => {
  let response;
  try{
    let results = await connection.promise().query(
      `DELETE FROM books WHERE book_id="${id}";`)
    response = results[0]
  } catch(err) {
    throw err;
  }
  return response
}

const modifyBook = async(id, entry) => {
  let response;
  let field = Object.keys(entry)[0];

  try{
    let results = await connection.promise().query(
      // this complicated AF code checks if the input is a number or not
      // if it is a number, return it as is to insert it as a number in the table
      // if it is a string add "" to let the db know that ii is a string
      `UPDATE books SET ${field} = 
      ${typeof entry[field] === "number" ?  entry[field] : "'" + entry[field] + "'"}
      WHERE book_id="${id}";`)
    response = results[0]
  } catch(err) {
    throw err;
  }
  return response
}

module.exports = { getBooks, addBook, deleteBook, modifyBook };