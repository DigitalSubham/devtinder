const User = require("../models/user");
const bcrypt = require("bcrypt");

export const viewProfile = async (requestAnimationFrame, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const editProfile = async (req, res) => {
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
    res.send(updateUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { password, id } = req.user;
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, password);
    if (!isOldPasswordCorrect) {
      throw new Error("Old Password is not correct");
    }
    if (oldPassword === newPassword) {
      throw new Error("Old Password passwords cannot be same");
    }
    const hashpassowrd = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashpassowrd });
    res.send("password updated succesfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
