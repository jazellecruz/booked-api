const { connection } = require("../db/db");

const addReview = async(review, res) => {
  let { book_id, rating, comment } = review
  
  try{
    let result = await connection.promise().query(
      `START TRANSACTION;
       INSERT INTO reviews (book_id, rating, review)
       VALUES (${book_id}, ${rating}, "${comment}");
       SET @last_review_id = LAST_INSERT_ID();
       UPDATE books SET review_id = @last_review_id WHERE book_id = ${book_id};
       COMMIT;`
      /*The START TRANSACTION and COMMIT statements are used to 
      ensure that the insert, set and update operations are done 
      atomically as a single transaction. - ChatGPT*/
    );
    res.status(200).send(result[0])
  } catch(err){
    if(err.errno === 1452) {
      res.status(404).send("Request failed. 0 resource matched.");
      console.log(err);
    } else {
      res.status(500).send("Internal Server Error");
      console.log(err);
    }
  }

}

const modifyReview = async(id, review, res) => {
  let field = Object.keys(review)[0];

  /* converts entry to string if not a number to avoid data type 
   error when updating fields in db */
  let newEntry = typeof review[field] === "number" ?  review[field] : `"${review[field].toString()}"`;

  try{
    let result = await connection.promise().query(
      `UPDATE reviews SET ${field} = ${newEntry} WHERE review_id="${id}";`
    )
    if(result[0].affectedRows) {
      res.status(200).send("Successfully modified item.")
    } else {
      res.status(404).send("No item modified. 0 resource matched.")
    }
  } catch(err){
    res.status(500).send("Internal Server Error");
    console.log(err);
  }
}

const deleteReview = async(id, res) => {

  try{
    let result = await connection.promise().query(
      `START TRANSACTION; 
       SET FOREIGN_KEY_CHECKS=0;
       DELETE FROM reviews WHERE review_id = "${id}";
       UPDATE books SET review_id = NULL WHERE review_id = "${id}";
       SET FOREIGN_KEY_CHECKS=1;
       COMMIT;`);

    res.send(result)
  } catch(err){
    res.status(500).send("Internal Server Error");
    console.log(err);
  }

}


module.exports = { addReview, modifyReview, deleteReview }

