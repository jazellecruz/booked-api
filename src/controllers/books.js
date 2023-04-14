const { connection } = require("../db/db");
const {formatFields} = require("../helpers/helpers")

const getBooks = async(res) => {

  try{
    let results = await connection.promise().query(
      `START TRANSACTION;
       SELECT books.book_id, title, author, description, img, categories.category, status.status, reviews.rating, reviews.review, dateAdded FROM books
       left JOIN categories ON books.category_id = categories.category_id
       left JOIN reviews ON books.review_id = reviews.review_id
       left JOIN status ON books.status_id = status.status_id
       ORDER BY dateAdded DESC;
       SELECT COUNT(*) FROM books WHERE books.status_id = 1;
       COMMIT;`
       );
      console.log(results[0])
      if(!results[0].length) {
        res.status(404).send("No resources found.");
      } else {
        res.status(200).send({
          books: results[0][1],
          totalOfFinishedBooks: results[0][2][0]["COUNT(*)"]
        });
      }

  } catch(err) {
    res.sendStatus(500);
    console.log(err);
  }
  
}

const filterBooks = async(query, res) => {

  try{  
    let results = await connection.promise().query(
      `SELECT books.book_id, 
              title, 
              author, 
              description, 
              img,
              categories.category, 
              status.status, 
              reviews.rating, 
              reviews.review, 
              dateAdded
      FROM books
      left JOIN categories ON books.category_id = categories.category_id
      left JOIN reviews ON books.review_id = reviews.review_id
      left JOIN status ON books.status_id = status.status_id
      WHERE ${formatFields("books", query, " AND ")}
      ORDER BY dateAdded DESC;`
    )
    
    if(!results[0].length) {
      res.status(404).send("No resources found.");
    } else {
      res.status(200).send({
        books: results[0],
        count: results[0].length
      })
    }

  } catch(err){
    res.sendStatus(500);
    console.log(err)
  }

}

const getBookById = async(bookId, res) => {
  try{
    let results = await connection.promise().query(
      `SELECT books.book_id, title, author, description, img, categories.category, status.status, reviews.rating, reviews.review, dateAdded FROM books
       left JOIN categories ON books.category_id = categories.category_id
       left JOIN reviews ON books.review_id = reviews.review_id
       left JOIN status ON books.status_id = status.status_id
       WHERE books.book_id = ${bookId};`);
      
       if(!results[0].length) {
        res.status(404).send("No resources found.")
       } else {
        res.status(200).send(results[0]);
       }

  } catch(err) {
    res.sendStatus(500);
    console.log(err)
  }
}

const addBook = async(newBook, res) => {
  let { title, author, description, category_id, status_id, img, rating, review } = newBook

  try{
    let results = await connection.promise().query(
      `START TRANSACTION;
       INSERT INTO books (title, author, description, category_id, status_id, img, dateAdded)
       VALUES ("${title}", 
              ${author ? `"${author}"` : null }, 
              ${description ? `"${description}"` : null }, 
              ${category_id}, 
              ${status_id}, 
              ${img ? `"${img}"` : null}, 
              curdate());
       SET @last_book_id = LAST_INSERT_ID();
       INSERT INTO reviews (reviews.book_id, rating, review)
       VALUES (@last_book_id,
               ${rating ? rating : null},
               ${review ? `"${review}"` : null});
       SET @last_review_id = LAST_INSERT_ID(); 
       UPDATE books 
       SET books.review_id = @last_review_id 
       WHERE book_id = @last_book_id;
       SELECT books.book_id, title, author, description, img, categories.category, status.status, reviews.rating, reviews.review, dateAdded FROM books
       left JOIN categories ON books.category_id = categories.category_id
       left JOIN reviews ON books.review_id = reviews.review_id
       left JOIN status ON books.status_id = status.status_id
       WHERE books.book_id = @last_book_id;
       COMMIT;`);
    
    if (!results[0][1].affectedRows && !results[0][3].affectedRows && !results[0][5].affectedRows) {
      res.status(202).send("Request acknowledged but not processed.");
    } else {
      res.status(200).send(results[0][6][0]);
    }

  } catch(err) {
    res.sendStatus(500);
    console.log(err)
  }

}

const deleteBook = async(bookId, res) => {
  try{
    let results = await connection.promise().query(
      `START TRANSACTION;
       SET FOREIGN_KEY_CHECKS=0;
       SET @review_id = (SELECT review_id FROM books WHERE book_id = "${bookId}");
       DELETE FROM reviews WHERE review_id = @review_id;
       DELETE FROM books WHERE books.book_id = ${bookId};
       SET FOREIGN_KEY_CHECKS=1;
       COMMIT;`)
    
    if (!results[0][3].affectedRows && !results[0][4].affectedRows) {
      res.status(404).send("Request failed. 0 resource matched.");
    } else {
      res.status(200).send("Item deleted successfully");
    }

  } catch(err) {
    if(err.errno === 1452) {
      res.status(422).send("Failed to process. Foreign key constraint violation.");
    } else {
      res.sendStatus(500);
      console.log(err)
    }
  }
}

const modifyBook = async(bookId, fieldsToModify, res) => {

  try{
    let results = await connection.promise().query(
    `UPDATE books SET ${formatFields("books", fieldsToModify, " , ")}  WHERE book_id="${bookId}";`)

    if (!results[0].affectedRows) {
      res.status(404).send("Request failed. 0 resource matched.");
    } else {
      res.status(200).send("Item successfully modified.");
    }
  } catch(err) {
    res.sendStatus(500);
    console.log(err)
  }

}


module.exports = { getBooks, filterBooks, getBookById, addBook, deleteBook, modifyBook };