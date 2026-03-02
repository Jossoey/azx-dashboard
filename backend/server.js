require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors({
  origin: "http://azx-frontend-prod.s3-website-ap-southeast-1.amazonaws.com",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

//PostgreSQL Connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test DB connection
pool.connect()
  .then(() => console.log("Connected to DB"))
  .catch(err => console.error("DB connection error:", err));

//Test Route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

//Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return Token
    res.json({
      success: true,
      token: token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Get inventory data
app.get("/api/inventory", async (req, res) => {
  try {
    // Query inventory
    const result = await pool.query("SELECT * FROM inventory ORDER BY model");

    res.json(result.rows); // Return
  } catch (error) {
    console.error("Inventory error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get sales data
app.get("/api/sales", async (req, res) => {
  try {
    // Query all sales records
    const result = await pool.query(`
      SELECT model, quantity, sale_date
      FROM sales
      ORDER BY sale_date
    `);

    res.json(result.rows); // Return
  } catch (error) {
    console.error("Sales error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});