const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

export const userConnections = async (req, res) => {
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
    res.send(data);
  } catch (error) {}
};

export const requestRecievedList = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "");

    // console.log("connectionRequest", connectionRequest, loggedInUser);
    res.send(connectionRequest);
  } catch (error) {}
};

export const feedList = async (req, res) => {
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
    res.send(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
