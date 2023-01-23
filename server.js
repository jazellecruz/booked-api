const express = require("express");
const app = express();

app.listen(8000, (req, res) => {
  console.log("Howdy from port 8000!");
});