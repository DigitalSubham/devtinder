const User = require("../models/user");
const bcrypt = require("bcrypt");

export const signUp = async (req, res) => {
  const { password, ...userObj } = req.body;

  let hashPassword;
  if (password) {
    hashPassword = await bcrypt.hash(password, 10);
  }
  const user = new user({ ...userObj, password: hashPassword });
  await user.save();
  const token = await user.getJwt();
  res.cookie("token", token, {
    expires: new Date(Date.now() + 900000),
  });

  res.send("data added successful");
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Email not Found");
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (isPassword) {
      const token = await user.getJwt();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 900000),
      });
      res.send({ user: user, message: "login successful done" });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const logout = async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout successful");
};
