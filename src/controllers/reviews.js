const { connection } = require("../db/db");

const addReview = async(review) => {
  let response;
  let { book_id, rating, comment } = review
  try{
    let result = await connection.promise().query(
      `START TRANSACTION;
       INSERT INTO reviews (book_id, rating, comment)
       VALUES (${book_id}, ${rating}, '${comment}');
       SET @last_review_id = LAST_INSERT_ID();
       UPDATE books SET review_id = @last_review_id WHERE book_id = ${book_id};
       COMMIT;`
      /*The START TRANSACTION and COMMIT statements are used to 
      ensure that the insert, set and update operations are done 
      atomically as a single transaction. - ChatGPT*/
    );
    response = result[0]
  } catch(err){
    throw err;
  }

  return response;
}

const modifyReview = async(id, review) => {
  let response;
  let field = Object.keys(review)[0];
  // the line below checks if argument is a string or a number
  // if arg is number return it as is, if string return it as string
  // this avoids data type error when updating fields in db
  let newEntry = typeof review[field] === "number" ?  review[field] : "'" + review[field] + "'";

  try{
    let result = await connection.promise().query(
      `UPDATE reviews SET ${field} = ${newEntry} WHERE review_id="${id}";`
    )
    response = result;
  } catch(err){
    throw err
  }

  return response;
}

const deleteReview = async(id) => {
  let response;

  try{
    let result = await connection.promise().query(
      `START TRANSACTION; 
       SET FOREIGN_KEY_CHECKS=0;
       DELETE FROM reviews WHERE review_id = "${id}";
       UPDATE books SET review_id = NULL WHERE review_id = "${id}";
       SET FOREIGN_KEY_CHECKS=1;
       COMMIT;`);
       // the query above is executed a bit slow 
       // need to change the query in the future
    response = result[0];
  } catch(err){
    throw err;
  }

  return response;
}


module.exports = { addReview, modifyReview, deleteReview }

