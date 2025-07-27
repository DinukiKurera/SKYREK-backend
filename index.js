import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// JWT Authentication Middleware
app.use((req, res, next) => {
  const value = req.header("Authorization");

  if (value != null) {
    const token = value.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || decoded == null) {
        return res.status(403).json({
          message: "Unauthorized",
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    next(); // No token provided, allow access to public routes
  }
});

// MongoDB Connection
const connectionString = process.env.MONGO_URI;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("✅ Connected to database");
  })
  .catch(() => {
    console.log("❌ Failed to connect to the database");
  });

// Routers
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

// Start Server
app.listen(5000, () => {
  console.log("🚀 Server started on port 5000");
});
