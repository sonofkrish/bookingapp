import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoute from "./routes/auth.js";
import hotelsRoute from "./routes/hotels.js";
import usersRoute from "./routes/users.js";
import roomsRoute from "./routes/rooms.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", false);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to mongodb");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

//middlewares
app.use(express.json()); // To support json request data

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/hotels", hotelsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected back!");
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend!");
});
