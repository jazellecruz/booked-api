const { connection } = require("../db/db");
const {formatFields} = require("../helpers/helpers");

const addReview = async(bookReview, res) => {
  let { book_id, rating, review } = bookReview
  
  try{
    let result = await connection.promise().query(
      `START TRANSACTION;
       INSERT INTO reviews (book_id, rating, review)
       VALUES (${book_id}, ${rating}, "${review}");
       SET @last_review_id = LAST_INSERT_ID();
       UPDATE books SET review_id = @last_review_id WHERE book_id = ${book_id};
       COMMIT;`
    );
    
    if(!result[0][1].affectedRows && !result[0][3].affectedRows) {
      res.status(202).send("Request acknowledged but not processed.");
    } else {
      res.status(200).send("Successfully added resource!")
    }
  }catch(err) {
    if (err.errno === 1452){
      res.status(422).send("Failed to process. Foreign key constraint violation.");
    } else {
      res.sendStatus(500);
      console.log(err)
    }
  }

}

const modifyReview = async(reviewId, fieldsToModify, res) => {

  try{
    let result = await connection.promise().query(
      `UPDATE reviews SET ${formatFields("reviews", fieldsToModify, " , ")} WHERE review_id="${reviewId}";`
    );

    if(!result[0].affectedRows) {
      res.status(404).send("No item modified. 0 resource matched.")
    } else {
      res.status(200).send("Successfully modified item.")
    }

  }catch(err) {
    res.sendStatus(500);
    console.log(err)    
  }
}

const deleteReview = async(reviewId, res) => {

  try{
    let result = await connection.promise().query(
      `START TRANSACTION; 
       SET FOREIGN_KEY_CHECKS=0;
       DELETE FROM reviews WHERE review_id = "${reviewId}";
       UPDATE books SET review_id = NULL WHERE review_id = "${reviewId}";
       SET FOREIGN_KEY_CHECKS=1;
       COMMIT;`);

    if(!result[0][2].affectedRows && !result[0][3].affectedRows){
      res.status(404).send("No item deleted. 0 resources matched.");
    } else {
      res.status(200).send("Successfully deleted resource!")
    }

  } catch(err){
    if (err.errno === 1452){ 
      res.status(422).send("Failed to process. Foreign key constraint violation.");
    } else {
      res.sendStatus(500);
      console.log(err)
    }
  }
}


module.exports = { addReview, modifyReview, deleteReview }

