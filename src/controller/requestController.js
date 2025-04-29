const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const { sendResponse } = require("../../utils/sendResponse");

exports.sendRequest = async (req, res) => {
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
      return sendResponse(res, 400, false, "Invalid status type");
    }

    const findUser = await User.findById(toUserId);
    if (!findUser) {
      return sendResponse(res, 400, false, "User not found");
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
    return sendResponse(
      res,
      200,
      true,
      "connection request send succesfully",
      data
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

exports.recievedRequest = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return sendResponse(res, 404, false, "Invalid Status");
    }

    const connectionReq = await ConnectionRequestModel.findOne({
      fromUserId: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!connectionReq) {
      return sendResponse(res, 400, false, "connection req not found");
    }

    connectionReq.status = status;
    const data = await connectionReq.save();
    return sendResponse(res, 200, true, `request ${status} succesfully`, data);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};
