const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  viewProfile,
  editProfile,
  changePassword,
} = require("../controller/profileController");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, viewProfile);

profileRouter.patch("/profile/edit", userAuth, editProfile);

profileRouter.patch("/profile/password", userAuth, changePassword);

module.exports = profileRouter;
