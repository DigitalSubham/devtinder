const { sendResponse } = require("../../utils/sendResponse.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  try {
    const { password, ...userData } = req.body;

    if (!password) {
      return sendResponse(res, 400, false, "Password is required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      ...userData,
      password: hashedPassword,
    });

    await newUser.save();

    const token = await newUser.getJwt();

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });

    return sendResponse(res, 200, true, "User created successfully", token);
  } catch (error) {
    console.error("Signup Error:", error);
    return sendResponse(res, 500, false, "Internal Server Error");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return sendResponse(res, 404, false, "Email not Found");
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (isPassword) {
      const token = await user.getJwt();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
      });
      return sendResponse(res, 200, true, "login successful done", user);
    } else {
      return sendResponse(res, 404, false, "Invalid Credentials");
    }
  } catch (error) {
    return sendResponse(res, 404, false, "error.message");
  }
};

exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  return sendResponse(res, 200, true, "Logout successful");
};
