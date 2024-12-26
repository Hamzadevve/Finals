const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Import routes
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const borrowerRoutes = require("./routes/borrowerRoutes");

// App initialization
const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/finals").then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process on failure
  });


app.get('/', (req, res) => {
    res.send("THIS IS HOMEPAGE!!!")
});


// Routes
app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/borrowers", borrowerRoutes);

// Centralized error handling
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

// Start the server
const PORT = 3000; // You can change this to your desired port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
