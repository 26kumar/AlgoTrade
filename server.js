import express from "express";
import { restClient } from "@polygon.io/client-js";
import fs from "fs";
import path from "path";
import cors from "cors"; // Import CORS

const app = express();
const PORT = `https://algotrade-node-server.onrender.com` || 5000;
const API_KEY = "1oe0pxJuzKk38F3fa8q0hkVjh9g8tbGl"; // Replace with your actual Polygon API key
const rest = restClient(API_KEY);

// Create data directory if it doesn't exist
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`✅ Created data directory: ${DATA_DIR}`);
}

// Enable CORS for frontend access
app.use(cors({
  origin: "*",  // Allows all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// app.use(
//   cors({
//     origin: ["https://project-mocha-delta-69.vercel.app/"], // Vercel frontend URL
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// );

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
    console.log(`🔍 Fetching stock data for ${STOCK_SYMBOL} from ${fromDate} to ${toDate}...`);
    
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
    console.log(`✅ Received ${stockData.length} data points from Polygon API`);
    
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    const filePath = path.join(DATA_DIR, "stock_data.csv");
    console.log(`📝 Saving data to ${filePath}`);

    // Create CSV content with header
    const csvHeader = "timestamp,open,high,low,close,volume\n";
    const csvRows = stockData
      .map((data) => `${data.t},${data.o},${data.h},${data.l},${data.c},${data.v}`)
      .join("\n");

    // Write the full file at once (not append)
    fs.writeFileSync(filePath, csvHeader + csvRows);
    
    console.log(`✅ Stock data saved successfully to ${filePath}!`);
    return true;
  } catch (error) {
    console.error("❌ Error fetching stock data:", error.message);
    return false;
  }
};

// Home route
app.get("/", (req, res) => {
  res.send(`
    <h2>🚀 AlgoTrade Stock Data Server</h2>
    <p>Server is running! Try these endpoints:</p>
    <ul>
      <li><a href='/api/check-file'>/api/check-file</a> - Check if stock data file exists</li>
      <li><a href='/api/fetch-data'>/api/fetch-data</a> - Fetch and save fresh stock data</li>
    </ul>
  `);
});

// API to fetch fresh data
app.get("/api/fetch-data", async (req, res) => {
  try {
    const success = await fetchStockData();
    if (success) {
      res.json({ message: "✅ Stock data fetched and saved successfully" });
    } else {
      res.status(500).json({ message: "❌ Failed to fetch stock data" });
    }
  } catch (error) {
    console.error("Error in fetch-data endpoint:", error);
    res.status(500).json({ message: `❌ Error: ${error.message}` });
  }
});

// API to check if the file is saved
app.get("/api/check-file", (req, res) => {
  const filePath = path.join(DATA_DIR, "stock_data.csv");

  if (fs.existsSync(filePath)) {
    try {
      // Get file size
      const stats = fs.statSync(filePath);
      const fileSizeInKB = stats.size / 1024;
      
      // Get line count (rows)
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const rows = fileContent.split('\n').length - 1; // -1 for header
      
      res.json({ 
        message: `✅ Stock data file found (${fileSizeInKB.toFixed(2)} KB, ${rows} rows)`,
        exists: true,
        size_kb: fileSizeInKB.toFixed(2),
        rows: rows
      });
    } catch (error) {
      res.json({ 
        message: `⚠️ Stock data file found but couldn't read details: ${error.message}`,
        exists: true 
      });
    }
  } else {
    res.json({
      message: "❌ Stock data file not found!",
      exists: false
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Stock Data Server running on port ${PORT}`);
  console.log(`📁 Data Directory: ${DATA_DIR}`);
  
  // Fetch stock data on startup
  fetchStockData();
});
