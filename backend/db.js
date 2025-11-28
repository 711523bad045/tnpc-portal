const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // leave empty if you didn't set a MySQL password
  database: "tnpc_portal"
});

db.connect((err) => {
  if (err) {
    console.log("MySQL connection error:", err);
  } else {
    console.log("MySQL connected successfully!");
  }
});

module.exports = db;
