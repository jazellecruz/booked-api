const { connection } = require("../db/db");

const getStatus = async(res) => {

  try {
    let results = await connection.promise().query(`SELECT * FROM status`);

    if(!results[0].length) {
      res.status(404).send("No resources found.");
    } else {
      res.status(200).send(results[0]);
    }
    
  } catch(err){
    res.sendStatus(500);
    console.log(err);
  }

}


module.exports = {getStatus}