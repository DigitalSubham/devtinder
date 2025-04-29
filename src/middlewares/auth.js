var jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send({ message: "Please Login" });
    }

    const { _id } = await jwt.verify(token, "Subham@123");
    if (!_id) {
      throw new Error("Invalid TOken");
    }

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not Found");
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { userAuth };
