const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Analytics Dashboard</h1><p>Server is running!</p>");
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Simple server running on http://127.0.0.1:5000");
});
