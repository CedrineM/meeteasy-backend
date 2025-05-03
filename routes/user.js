//import des packages

const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

//import des modèles
const User = require("../models/User");

//CRUD
//Create
router.post("/user/signup", async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.username || !req.body.email) {
      throw {
        message: "You must enter an username and an email ",
        status: 400,
      };
    } else if (req.body.password !== req.body.confirmePassword) {
      throw { message: "Passwords must be identical", status: 400 };
    } else if (req.body.email.indexOf("@") === -1) {
      throw { message: "You must right an email", status: 400 };
    }
    if (await User.findOne({ email: req.body.email })) {
      throw { message: "This account already exists", status: 409 };
    }

    //création du salt
    const newSalt = uid2(16);

    //création du token
    const newToken = uid2(64);

    //concaténation du password+salt - et création du hash
    const newHash = SHA256(req.body.password + newSalt).toString(encBase64);

    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      token: newToken,
      hash: newHash,
      salt: newSalt,
    });

    console.log(newUser);
    await newUser.save();

    return res.status(201).json([
      { message: "The account has been created successfully" },
      {
        _id: newUser._id,
        token: newUser.token,
        username: newUser.username,
      },
    ]);
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
});

//route création d'une note
//Read
//Update
//Delete

module.exports = router;
