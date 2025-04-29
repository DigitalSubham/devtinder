const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

export const sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const acceptedRequest = ["interested", "ignored"];

    //   if (fromUserId.equals(toUserId)) {
    //     return res.status(400).json({
    //       message: "Invalid",
    //     });
    //   }
    if (!acceptedRequest.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type",
      });
    }

    const findUser = await User.findById(toUserId);
    if (!findUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId: fromUserId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).json({
        message: "Connection already happend",
      });
    }

    const connectionRequest = await new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();
    res.json({
      message: "connection request send succesfully",
      data: data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const recievedRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid Status" });
    }

    const connectionReq = await ConnectionRequestModel.findOne({
      fromUserId: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionReq) {
      return res.status(404).json({ message: "connection req not found" });
    }

    connectionReq.status = status;
    const data = await connectionReq.save();
    res.json({ message: "" });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
