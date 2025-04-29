const express = require("express");
const { userAuth } = require("../middlewares/auth");

const {
  sendRequest,
  recievedRequest,
} = require("../controller/requestController");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, sendRequest);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  recievedRequest
);

module.exports = requestRouter;
