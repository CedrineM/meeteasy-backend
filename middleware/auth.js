//import model user
const User = require("../models/User");

//fonction d'authentification
const authenticated = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw {
        message: "you are not authorized, your need to connect",
        error: 401,
      };
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    // console.log(token);
    const userFind = await User.findOne({ token: token });
    // console.log(userFind);
    if (!userFind) {
      throw {
        message: "you are not authorized, your need to connect",
        error: 401,
      };
    }
    req.user = userFind;
    next(); //permet de passer au middleware suivant
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

module.exports = authenticated;
