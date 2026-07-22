const express = require("express");
const path = require("path");

const app = express();

console.log("Starting test server...");
console.log("__dirname:", __dirname);
console.log("Public path:", path.join(__dirname, "public"));

app.get("/", (req, res) => {
  console.log("GET / received");
  const file = path.join(__dirname, "public", "index.html");
  console.log("Sending:", file);
  res.sendFile(file, (err) => {
    if (err) console.error("Error sending file:", err);
  });
});

app.get("/test", (req, res) => {
  res.send("Test route works!");
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
