//import des packages

const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const mongoose = require("mongoose");

//import des modèles
const User = require("../models/User");
const Note = require("../models/Note");

//import middleware
const auth = require("../middleware/auth");
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

//connexion
router.post("/user/login", async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ email: req.body.email });
    //Est ce que les informations communiquer sont correct
    if (!user) {
      throw {
        message: "The information communicated are not correct ",
        status: 401,
      };
    }
    const hashReq = SHA256(req.body.password + user.salt).toString(encBase64);
    if (hashReq !== user.hash) {
      throw {
        message: "The information communicated are not correct ",
        status: 401,
      };
    }
    return res.status(202).json({
      _id: user._id,
      token: user.token,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server Error" });
  }
});

//Read
router.get("/user", auth, (req, res) => {
  try {
    const { hash, salt, token, _id, ...safeUser } = req.user.toObject();
    return res.status(200).json(safeUser);
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server Error" });
  }
});
//Update
router.put("/user", auth, async (req, res) => {
  try {
    console.log(req.body);
    //mise à jour du user
    const { username, email, password, confirmePassword } = req.body;
    const updates = {};
    if (username !== undefined) updates.username = username;
    if (email !== undefined) updates.email = email;
    if (password !== undefined) {
      if (password !== confirmePassword) {
        throw {
          message: "Passwords must be identical",
          status: 401,
        };
      }
      //concaténation du password+salt - et création du hash
      const newHash = SHA256(password + req.user.salt).toString(encBase64);
      updates.hash = newHash;
    }

    Object.assign(req.user, updates);

    await req.user.save();
    return res
      .status(200)
      .json({ message: "This information has been successfully modified" });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server Error" });
  }
});
//Delete

router.delete("/user", auth, async (req, res) => {
  try {
    await Note.deleteMany({
      userId: req.user._id,
    });
    await req.user.deleteOne();
    return res
      .status(200)
      .json({ message: "This account has been successfully deleted " });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server Error" });
  }
});

module.exports = router;
