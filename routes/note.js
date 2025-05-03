//import des packages

const express = require("express");
const router = express.Router();

//import des modèles
const Note = require("../models/Note");

//CRUD
//Create
router.post("/note", (req, res) => {
  try {
    console.log(req.body);

    return res
      .status(201)
      .json({ message: "The note has been saved successfully" });
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
