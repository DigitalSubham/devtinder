const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const experienceSchema = new mongoose.Schema({
  id: String,
  role: String,
  company: String,
  duration: String,
  description: String,
});

const educationSchema = new mongoose.Schema({
  id: String,
  degree: String,
  institution: String,
  year: String,
});

const projectSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  techUsed: [String],
  link: String,
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    githubUsername: String,
    email: String,
    password: String,
    bio: String,
    location: String,
    website: String,
    twitter: String,
    linkedin: String,
    techStack: [String],
    experience: [experienceSchema],
    education: [educationSchema],
    projects: [projectSchema],
  },
  { timestamps: true }
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Subham@123", {
    expiresIn: "1d",
  });
  return token;
};

module.exports = mongoose.model("User", userSchema);
