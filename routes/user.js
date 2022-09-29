const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const router = express.Router();

const User = require("../models/user");

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("password").isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ message: errors.array()[0].msg });
    }
    User.findOne({ email: req.body.email }).then((fetchedUser) => {
      if (fetchedUser) {
        return res.status(403).json({
          message: "User is already exist.",
          success: false
        });
      }
      const user = new User({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 12),
      });
      user
        .save()
        .then((result) => {
          if (!result) {
            return res.status(403).json({
              message: "Could not create the user.",
              success: false
            });
          }
          res.status(200).json({
            message: "User created successfully.",
            success: true
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Could not create the user.",
            success: false
          });
        });
    });
  }
);

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        throw new Error("Auth failed");
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((isMatched) => {
      if (!isMatched) {
        return res.status(401).json({ message: "Auth failed.", success: false });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "730h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 43800,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Invalid authentication credentials.",
        success: false
      });
    });
});

module.exports = router;
