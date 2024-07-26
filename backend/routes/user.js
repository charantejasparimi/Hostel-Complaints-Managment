const express = require("express");
const {
  registerUser,
  authenticate,
  authenticate_2,
  editprofile,
  updateprofile,
  forgotPassword,
} = require("../controllers/usercontroller");

const router = express.Router();
console.log("user.js");
router.route("/signin").post(registerUser);
router.route("/login").post(authenticate);
router.route("/validateToken").post(authenticate_2);
router.route("/editprofile").post(editprofile);
router.route("/updateProfile").post(updateprofile);
router.route("/forgotpassword").post(forgotPassword);
module.exports = router;
