const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("This is Online Camera Warehouse.");
});

app.listen(port, () => {
  console.log("Running to the CRUD.");
});