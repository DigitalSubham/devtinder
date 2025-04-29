var jwt = require("jsonwebtoken");
const User = require("../models/user");
const { sendResponse } = require("../../utils/sendResponse");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return sendResponse(res, 401, false, "Please Login First");
    }

    const { _id } = await jwt.verify(token, "Subham@123");
    if (!_id) {
      throw new Error("Invalid TOken");
    }

    const user = await User.findById(_id);
    if (!user) {
      return sendResponse(res, 404, false, "User not Found");
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

module.exports = { userAuth };
