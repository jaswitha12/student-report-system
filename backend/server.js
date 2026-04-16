const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("students.db");

// CREATE TABLE
db.run(`CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  roll TEXT UNIQUE,
  data TEXT
)`);

// SAVE OR UPDATE
app.post("/saveStudent", (req, res) => {
  const { name, roll, data } = req.body;

  db.get("SELECT * FROM students WHERE roll=?", [roll], (err, row) => {

    if (row) {
      db.run(
        "UPDATE students SET name=?, data=? WHERE roll=?",
        [name, JSON.stringify(data), roll],
        () => res.send("Updated Successfully")
      );
    } else {
      db.run(
        "INSERT INTO students (name, roll, data) VALUES (?, ?, ?)",
        [name, roll, JSON.stringify(data)],
        () => res.send("Saved Successfully")
      );
    }

  });
});

// GET DATA
app.get("/student/:roll", (req, res) => {
  db.get("SELECT * FROM students WHERE roll=?", [req.params.roll], (err, row) => {

    if (!row) return res.send("No data found");

    res.json({
      name: row.name,
      roll: row.roll,
      data: JSON.parse(row.data)
    });

  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

