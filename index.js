const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");
require("dotenv").config();
app.use(cors());
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`App is running at ${process.env.PORT}`);
});
