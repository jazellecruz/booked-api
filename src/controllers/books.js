const { connection } = require("../db/db");

const getBooks = async() => {
  let response;
  try{
    let results = await connection.promise().query(
      `SELECT books.book_id, title, author, description, categories.category, status.status, reviews.rating, reviews.comment, dateAdded FROM books
       left JOIN categories ON books.category_id = categories.category_id
       left JOIN reviews ON books.review_id = reviews.review_id
       left JOIN status ON books.status_id = status.status_id
       ORDER BY dateAdded DESC;`)
    response = results[0]
  } catch(err) {
    throw err;
  }
  return response
}

const addBook = async(book) => {
  let response;
  let { title, author, description, category_id, status_id, review_id } = book
  try{
    let results = await connection.promise().query(
      `INSERT INTO books (title, author, description, category_id, status_id, review_id, dateAdded) 
       VALUES ("${title}", 
              ${author ? `"${author}"` : null }, 
              ${description ? `"${description}"` : null }, 
              ${category_id}, 
              ${status_id}, 
              ${review_id ? review_id : null}, 
              curdate());`)
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
  // the line below checks if argument is a string or a number
  // if arg is number return it as is, if string return it as string
  // this avoids data type error when updating fields in db
  let newEntry = typeof entry[field] === "number" ?  entry[field] : "'" + entry[field] + "'";
  try{
    let results = await connection.promise().query(
    `UPDATE books SET ${field} = ${newEntry} WHERE book_id="${id}";`)
    response = results[0]
  } catch(err) {
    throw err;
  }
  return response
}


module.exports = { getBooks, addBook, deleteBook, modifyBook };