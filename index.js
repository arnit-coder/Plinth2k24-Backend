const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const comRoutes = require("./routes/competition");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");
require("dotenv").config();
app.use(cors({
  origin:["*"],
	credentials:true,
}));
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/compete", comRoutes);
app.use("/team", require("./routes/team"));

app.use("/", (req, res) => {
  res.status(200).send("Server is up and running!!!");
});

app.listen(process.env.PORT, () => {
  console.log(`App is running at ${process.env.PORT}`);
});
