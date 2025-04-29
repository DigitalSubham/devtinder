const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDb = require("./config.js/database");
const app = express();
var cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173/",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const requestsRouter = require("./routes/requests");
const { sendResponse } = require("../utils/sendResponse");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

app.use("/test", (req, res) => {
  sendResponse(res, 200, true, "Hello from Server");
});

connectDb()
  .then(() => {
    console.log("database connection successful");
    app.listen(process.env.PORT, () => {
      console.log(`Server is started at ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
