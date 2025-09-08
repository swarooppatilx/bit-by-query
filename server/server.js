const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const cors = require("./middleware/cors");
const errorHandler = require("./middleware/errorHandler");
const loadProblems = require("./utils/loadProblems");
const db = require("./utils/db");
const solve_db = require("./utils/solver.js").solvePool;

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

// import Limiter
const { authRateLimiter, apiRateLimiter } = require('./middleware/rateLimiting/index');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors);

// Serve frontend
app.use(express.static(path.join(__dirname, "..", "client/dist")));

// Load problems once
app.locals.problems = loadProblems();

// API Routes

// app.use("/api", authRoutes);
app.use("/api", authRateLimiter, authRoutes);

app.use("/api", apiRateLimiter, leaderboardRoutes);

// for these all routes i have made a separate api limiter so for that 'id' is needed 
// so i used in routes separtely  

app.use("/api", userRoutes);
app.use("/api", problemRoutes);
app.use("/api", submissionRoutes);



// Fallback to frontend
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client/dist/index.html"));
});

// Error handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown
process.on("SIGINT", async() => {
    await db.end();
    await solve_db.end();
    process.exit(0);
});