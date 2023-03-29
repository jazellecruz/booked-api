const { connection } = require("../db/db");

const getStatus = async(res) => {

  try {
    let results = await connection.promise().query(`SELECT * FROM status`);

    if(results[0].length === 0) {
      res.status(404).send("No resources found.");
    } else {
      res.status(200).send(results[0]);
    }
    
  } catch(err){
    res.status(500).send("Internal Server Error")
    console.log(err);
  }

}


module.exports = {getStatus}