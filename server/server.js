const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const interestRoutes = require("./routes/interestRoutes");
const friendRoutes = require("./routes/friendRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const miscRoutes = require("./routes/miscRoutes");
const chatHistoryRoutes = require("./routes/chatHistoryRoutes");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// HTTPS redirect middleware
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    console.log("Redirecting to HTTPS");
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static(path.join(__dirname, "../build")));

// Set up SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api", miscRoutes);
app.use("/api/chat-history", chatHistoryRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
