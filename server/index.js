const express = require("express");
const bodyParser = require("body-parser");
const bycrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const Pool = require("pg").Pool;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const pool = require("./queries");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  pool.query("SELECT * FROM Users", (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results.rows);
  });
});

app.post("/create-user", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const client = await pool.connect();

    // Use a parameterized query to avoid SQL injection
    const query = "SELECT * FROM Users WHERE email = $1";
    const result = await client.query(query, [email]);

    if (result.rows.length > 0) {
      // Email already exists in the table
      res.status(409).send({ error: "Email already exists" });
    } else {
      bycrypt.hash(password, 10, async (err, hash) => {
        pool.query(
          "INSERT INTO users (uid, email, password, name) VALUES ($1, $2, $3, $4)",
          [uuidv4(), email, hash, name],
          (error, results) => {
            if (error) {
              res.status(501).send(error);
            } else {
              res.status(201).send({ message: "User added" });
            }
          }
        );
      });
    }

    client.release();
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Check if the email match the password from the database

app.get("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await connect();

    // Use a parameterized query to avoid SQL injection
    const query = "SELECT * FROM Users WHERE email = $1";
    const result = await client.query(query, [email]);

    if (result.rows.length === 0) {
      // Email already exists in the table
      res.status(404).send({ error: "Email does not exists" });
    } else {
      compare(password, result.rows[0].password, (err, result) => {
        if (result) {
          res.status(202).send({ message: "Login successful" });
        } else {
          res.status(403).send({ message: "Login failed" });
        }
      });
    }

    client.release();
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));