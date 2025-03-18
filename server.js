import express from "express";
import { restClient } from "@polygon.io/client-js";
import fs from "fs";
import path from "path";
import cors from "cors"; // Import CORS

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = "1oe0pxJuzKk38F3fa8q0hkVjh9g8tbGl"; // Replace with your actual Polygon API key
const rest = restClient(API_KEY);

// Enable CORS for frontend access
app.use(
  cors({
    origin: ["https://project-mocha-delta-69.vercel.app/"], // Vercel frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Define stock symbol
const STOCK_SYMBOL = "AAPL";

// Generate date range (Last 1 year)
const today = new Date();
const fromDate = new Date(today - 365 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0]; // 1 year ago
const toDate = today.toISOString().split("T")[0]; // Today

// Function to fetch stock data
const fetchStockData = async () => {
  try {
    const response = await rest.stocks.aggregates(
      STOCK_SYMBOL,
      1,
      "day",
      fromDate,
      toDate,
      { adjusted: true }
    );

    if (!response || !response.results) {
      throw new Error("No data found.");
    }

    const stockData = response.results;
    const filePath = path.join("/tmp", "stock_data.csv"); // Save in /tmp for Render

    // Create CSV Header (if file doesn't exist)
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "timestamp,open,high,low,close,volume\n");
    }

    // Append stock data to CSV
    const csvRows = stockData
      .map((data) => `${data.t},${data.o},${data.h},${data.l},${data.c},${data.v}`)
      .join("\n");

    fs.appendFileSync(filePath, csvRows + "\n");
    console.log("✅ Stock data saved successfully!");
  } catch (error) {
    console.error("❌ Error fetching stock data:", error.message);
  }
};

// Fetch and save stock data on startup
fetchStockData();

app.get("/", (req, res) => {
  res.send("<h2>🚀 Server is running! Try accessing <a href='/api/check-file'>/api/check-file</a></h2>");
});


// API to check if the file is saved
app.get("/api/check-file", (req, res) => {
  const filePath = path.join("/tmp", "stock_data.csv");

  if (fs.existsSync(filePath)) {
    res.json({ message: "✅ Stock data retrieved" });
  } else {
    res.json({ message: "❌ File not found!" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
