const { sendResponse } = require("../../utils/sendResponse");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.viewProfile = async (req, res) => {
  try {
    const user = req.user;
    return sendResponse(res, 200, false, "fetched profile successfully", user);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.body;
    // if (!validateEditProfile(req)) {
    //   throw new Error("Invalid Edit Request");
    // }
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $set: user },
      { new: true, runValidators: true }
    );
    return sendResponse(res, 200, true, "profile updated successfully");
    res.send(updateUser);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { password, id } = req.user;
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, password);
    if (!isOldPasswordCorrect) {
      return sendResponse(res, 404, false, "Old Password is not correct");
    }
    if (oldPassword === newPassword) {
      throw new Error("Old Password passwords cannot be same");
    }
    const hashpassowrd = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashpassowrd });
    return sendResponse(res, 200, true, "password updated succesfully");
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};
