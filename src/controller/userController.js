const { sendResponse } = require("../../utils/sendResponse");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

exports.userConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "")
      .populate("toUserId", "");

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    return sendResponse(
      res,
      200,
      true,
      "connections fetched succesfully",
      data
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

exports.requestRecievedList = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "");

    return sendResponse(
      res,
      200,
      true,
      "data fetched succesfully",
      connectionRequest
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

exports.feedList = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;

    // find all connection request (sent or received)
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .skip((page - 1) * limit)
      .limit(limit);

    return sendResponse(res, 200, true, "data fetched succesfully", users);
    res.send(users);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};
