const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  userConnections,
  feedList,
  requestRecievedList,
} = require("../controller/userController");
const userRouter = express.Router();

userRouter.get("/users/connections", userAuth, userConnections);

userRouter.all("/users/requests/received", userAuth, requestRecievedList);

userRouter.get("/feed", userAuth, feedList);

module.exports = userRouter;
