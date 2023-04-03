const { connection } = require("../db/db");

const getBooks = async(res) => {

  try{
    let results = await connection.promise().query(
      `START TRANSACTION;
       SELECT books.book_id, title, author, description, img, categories.category, status.status, reviews.rating, reviews.review, dateAdded FROM books
       left JOIN categories ON books.category_id = categories.category_id
       left JOIN reviews ON books.review_id = reviews.review_id
       left JOIN status ON books.status_id = status.status_id
       ORDER BY dateAdded DESC;
       SELECT COUNT(*) FROM books WHERE status_id = 1;
       COMMIT;`
       );
      
      if(results[0].length === 0) {
        res.status(404).send("No resources found.");
      } else {
        res.status(200).send({
          books: results[0][1],
          totalOfFinishedBooks: results[0][2][0]["COUNT(*)"]
        });
      }

  } catch(err) {
    res.status(500).send("Internal Server Error")
    console.log(err);
  }
  
}

const filterBooks = async(query, res) => {

  let filter = (filterCriteria) => {
    let bookFilter = [];
    let filterKeys = Object.keys(filterCriteria);

    /* 
    NOTES:
      1. Check if query is >1. if true, assign the string "books.<key> = <value>" to the bookFilter variable
      2. If false, iterate filterKeys array and push the string containing the key value pairs.
      3. Once loop is done, join the items in the bookFilter array with "AND" to result to a string.
    */
    if (filterKeys.length === 1) {
      bookFilter = `books.${filterKeys[0]} = ${filterCriteria[filterKeys[0]]}`;
    } else {
      for(let i = 0; i < filterKeys.length; i++) {
        bookFilter.push(`books.${filterKeys[i]} = ${filterCriteria[filterKeys[i]]}`)
      };
      bookFilter = bookFilter.join(" AND ");
    }

    return bookFilter;
  }

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
      WHERE ${filter(query)}
      ORDER BY dateAdded DESC;`
    )
    
    if(results[0].length === 0) {
      res.status(404).send("No resources found.");
    } else {
      res.status(200).send({
        books: results[0],
        count: results[0].length
      })
    }

  } catch(err){
    res.status(500).send("Internal Server Error")
    console.log(err)
  }

}

const addBook = async(entry, res) => {
  let { title, author, description, category_id, status_id, img, rating, review } = entry

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
    
    if (results[0][1].affectedRows && results[0][3].affectedRows && results[0][5].affectedRows) {
      res.status(200).send(results[0][6][0]);
    } else {
      res.status(202).send("Request acknowledged but not processed.");
    }

  } catch(err) {
    res.status(500).send("Internal Server Error")
    console.log(err)
  }
l
}

const deleteBook = async(id, res) => {
  try{
    let results = await connection.promise().query(
      `START TRANSACTION;
       SET FOREIGN_KEY_CHECKS=0;
       SET @review_id = (SELECT review_id FROM books WHERE book_id = "${id}");
       DELETE FROM reviews WHERE review_id = @review_id;
       DELETE FROM books WHERE books.book_id = ${id};
       SET FOREIGN_KEY_CHECKS=1;
       COMMIT;`)
    
    if (results[0][3].affectedRows && results[0][4].affectedRows) {
      res.status(200).send("Item deleted successfully");
    } else {
      res.status(404).send("No item deleted. 0 resources matched.");
    }

  } catch(err) {
    res.status(500).send("Internal Server Error")
    console.log(err)
  }
}

const modifyBook = async(id, entry, res) => {
  let field = Object.keys(entry)[0];

  /* converts entry to string if not a number to avoid data type 
   error when updating fields in db */
  let newEntry = typeof entry[field] === "number" ?  entry[field] : `"${entry[field].toString()}"`
  console.log(entry[field].toString())
  try{
    let results = await connection.promise().query(
    `UPDATE books SET ${field} = ${newEntry} WHERE book_id="${id}";`)

    if (results[0].affectedRows) {
      res.status(200).send("Item successfully modified.");
    } else {
      res.status(404).send("No item modified. 0 resources matched");
    }
  } catch(err) {
    res.status(500).send("Internal Server Error")
    console.log(err)
  }
}


module.exports = { getBooks, filterBooks, addBook, deleteBook, modifyBook };