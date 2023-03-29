const { connection } = require("../db/db");

const getBooks = async(res) => {

  try{
    let results = await connection.promise().query(
      `START TRANSACTION;
       SELECT books.book_id, title, author, description, img, categories.category, status.status, reviews.rating, reviews.comment, dateAdded FROM books
       left JOIN categories ON books.category_id = categories.category_id
       left JOIN reviews ON books.review_id = reviews.review_id
       left JOIN status ON books.status_id = status.status_id
       ORDER BY reviews.rating DESC;
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

  let filter = (queryObject) => {
    let command;
    let keys = Object.keys(queryObject);

      if (typeof command === "string") {
        for(let i = 1; 1 > keys.length; i++){
          command = `${command} WHERE books.${keys[1]} = ${queryObject[keys[i]]}`
         }
      } else {
        command = `WHERE books.${keys[0]} = ${queryObject[keys[0]]}`
      }

    return command;
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
              reviews.comment, 
              dateAdded
      FROM books
      left JOIN categories ON books.category_id = categories.category_id
      left JOIN reviews ON books.review_id = reviews.review_id
      left JOIN status ON books.status_id = status.status_id
      ${filter(query)}
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

const addBook = async(book, res) => {
  let { title, author, description, category_id, status_id, review_id, img } = book

  try{
    let results = await connection.promise().query(
      `INSERT INTO books (title, author, description, category_id, status_id, review_id, img, dateAdded)
       VALUES ("${title}", 
              ${author ? `"${author}"` : null }, 
              ${description ? `"${description}"` : null }, 
              ${category_id}, 
              ${status_id}, 
              ${review_id ? review_id : null}, 
              ${img ? `"${img}"` : null}, 
              curdate());`);
    
    if (results[0].affectedRows) {
      res.status(200).send("Success");
    } else {
      res.status(202).send("Request acknowledged but not processed.");
    }

  } catch(err) {
    res.status(500).send("Internal Server Error")
    console.log(err)
  }

  // use output to return the newly inserted row and send to client to avoid another api call
}

const deleteBook = async(id, res) => {
  try{
    let results = await connection.promise().query(
      `DELETE FROM books WHERE book_id="${id}";`)
    
      // you can use !== 0 if there will be multiple rows affected
    if (results[0].affectedRows) {
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