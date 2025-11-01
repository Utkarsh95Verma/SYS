const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",        // your MySQL username
  password: "0123456",        // your MySQL password
  database: "studentdb"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// --- API Routes ---

// Get all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) res.status(500).send(err);
    else res.send(results);
  });
});

// Add a new student
app.post("/students", (req, res) => {
  const { name, roll, email, course } = req.body;
  const sql = "INSERT INTO students (name, roll, email, course) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, roll, email, course], (err, result) => {
    if (err) res.status(500).send(err);
    else res.send({ message: "Student added successfully" });
  });
});

// Update a student
app.put("/students/:id", (req, res) => {
  const { name, roll, email, course } = req.body;
  const { id } = req.params;
  const sql = "UPDATE students SET name=?, roll=?, email=?, course=? WHERE id=?";
  db.query(sql, [name, roll, email, course, id], (err, result) => {
    if (err) res.status(500).send(err);
    else res.send({ message: "Student updated successfully" });
  });
});

// Delete a student
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM students WHERE id=?", [id], (err, result) => {
    if (err) res.status(500).send(err);
    else res.send({ message: "Student deleted successfully" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});
