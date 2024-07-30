const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { collection } = require("../models/dbconnection"); // Adjust the path to the db.js file
const { validateUserData } = require("../models/userschema");

const gentoken = require("../utils/jwt");
const { ObjectId } = require("mongodb");

const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, hostel, room, email, password, role } = req.body;
  console.log("usercontroller.js registerUser", req.body);
  const userExists = await collection.findOne({ email });
  console.log("userExists:", userExists);
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const error = validateUserData(email, password);
  if (error != null) {
    res.status(400);
    throw new Error(error);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await collection.insertOne({
    firstname,
    lastname,
    hostel,
    room,
    email,
    password: hashedPassword,
    role,
  });

  if (user) {
    res.status(201).json({
      email,
      token: gentoken(user.insertedId),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const authenticate = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const user = await collection.findOne({ email, role });
  console.log("usercontroller.js authenticate", user);
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      email: user.email,
      token: gentoken(user._id),
      message: "Login successful!",
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

const authenticate_2 = asyncHandler(async (req, res) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("usercontroller.js authenticate_2");
      console.log(decoded.id);

      const user = await collection.findOne({ _id: new ObjectId(decoded.id) });
      console.log("Found user:", user);
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const editprofile = asyncHandler(async (req, res) => {
  const { firstname, lastname, hostel, room, email, password, id } = req.body; // Add id here
  console.log("usercontroller.js editprofile");
  const user = await collection.findOne({ _id: new ObjectId(id) });
  if (user && (await bcrypt.compare(password, user.password))) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await collection.updateOne(
      { email },
      {
        $set: {
          firstname,
          lastname,
          hostel,
          room,
          password: hashedPassword,
        },
      }
    );
    if (updatedUser) {
      res.status(200).json({
        email,
        token: gentoken(user._id),
        message: "Profile updated successfully!",
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

const updateprofile = asyncHandler(async (req, res) => {
  const { fname, lname, hostel, currentPassword, confirmPassword, email } =
    req.body;
  console.log(req.body);
  const user = await collection.findOne({ email });
  if (user && (await bcrypt.compare(currentPassword, user.password))) {
    const updateData = {
      firstname: fname,
      lastname: lname,
      hostel,
    };
    if (confirmPassword) {
      updateData.password = await bcrypt.hash(confirmPassword, 10);
    }
    await collection.updateOne(
      { email },
      {
        $set: updateData,
      }
    );
    res.status(200).json({ message: "Profile updated successfully" });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { token, email, password } = req.body;
  if (token) {
    console.log("token given");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await collection.findOne({ _id: new ObjectId(decoded.id) });
    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await collection.updateOne(
        { email },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );
      res.status(200).json({ message: "Password reset successful" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else if (email) {
    console.log("email given");
    const user = await collection.findOne({ email });
    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await collection.updateOne(
        { email },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );
      res.status(200).json({ message: "Password reset successful" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else {
    res.status(400).json({ message: "Invalid input" });
  }
});

module.exports = {
  registerUser,
  authenticate,
  authenticate_2,
  editprofile,
  updateprofile,
  forgotPassword,
};
