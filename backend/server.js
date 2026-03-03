require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors({
  origin: ["http://azx-frontend-prod.s3-website-ap-southeast-1.amazonaws.com"],
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

//Testing DB goor for debugging errors
pool.connect()
  .then(() => console.log("Connected to DB"))
  .catch(err => console.error("DB connection error:", err));

//Testing Backend good for debugging errors
app.get("/", (req, res) => {
  res.send("Backend is running");
});

//Login Route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Look up for email in DB
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Email not registered" });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Create Token for proof of authentication, can be used in the future for blocking other page if not logged in
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

// Register new user
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into DB
    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashedPassword]
    );

    res.json({ success: true, message: "Email registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get inventory data
app.get("/api/inventory", async (req, res) => {
  try {
    // Query list of inventory
    const result = await pool.query("SELECT * FROM inventory ORDER BY model");

    res.json(result.rows);
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

    res.json(result.rows);
  } catch (error) {
    console.error("Sales error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Get price and quantity per year
app.get("/api/revenue", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        EXTRACT(YEAR FROM s.sale_date)::INT AS year,
        SUM(s.quantity * p.price) AS total_revenue
      FROM sales s
      JOIN model_prices p ON s.model = p.model
      WHERE EXTRACT(YEAR FROM s.sale_date) IN (2024, 2025, 2026)
      GROUP BY year
      ORDER BY year DESC
    `);

    // Format data and to ensure numeric format
    const revenueData = result.rows.map(row => ({
      year: row.year,
      total_revenue: parseInt(row.total_revenue)
    }));

    // Compute YoY per year by adding yoy data at the back of revenueData
    const revenueWithGrowth = revenueData.map((r, i, arr) => {
      if (i === arr.length - 1) return { ...r, yoy: null };
      const prev = arr[i + 1].total_revenue;
      const yoy = ((r.total_revenue - prev) / prev * 100).toFixed(2);
      return { ...r, yoy: parseFloat(yoy) };
    });

    res.json(revenueWithGrowth);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all car models (for chatbot)
app.get("/api/carmodels", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM car_models ORDER BY name");

    res.json(result.rows);
  } catch (error) {
    console.error("Car models error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Recommend a car based on user preferences
app.post("/api/recommend", async (req, res) => {
  try {
    const { familySize, features = [], sizePref = "", budget } = req.body;

    // Fetch all car models from the database
    const result = await pool.query("SELECT * FROM car_models");
    const carModels = result.rows;

    if (!carModels.length) {
      return res.status(404).json({ message: "No car models found in database" });
    }

    // Scoring logic
    let maxScore = -1;
    let bestCar = null;

    carModels.forEach((car) => {
      let score = 0;

      // Check family size
      if (familySize >= car.min_seats && familySize <= car.max_seats) score += 1;

      // Check features (car.features stored as text array)
      features.forEach((f) => {
        if (car.features.includes(f)) score += 1;
      });

      // Optional size preference
      if (sizePref && car.size.toLowerCase() === sizePref.toLowerCase()) score += 1;

      // Optional budget check
      if (budget && car.price <= budget) score += 1;

      // Update best car
      if (score > maxScore) {
        maxScore = score;
        bestCar = car;
      }
    });

    if (!bestCar) {
      return res.status(404).json({ message: "No suitable car found" });
    }

    res.json({ recommendedCar: bestCar });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: "Server error" }); 
  }
});

//Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});