//import des packages

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//import des modèles
const Note = require("../models/Note");
const User = require("../models/User");

//import middleware
const auth = require("../middleware/auth");

//CRUD
//Create
//route création d'une note
router.post("/note", auth, async (req, res) => {
  try {
    // console.log(req.body);

    const {
      meetingType,
      meetingDate,
      meetingObject,
      participants,
      noteContent,
    } = req.body;

    if (
      !meetingType ||
      !meetingDate ||
      !meetingObject ||
      participants.length === 0 ||
      noteContent.length === 0
    ) {
      throw {
        message: "You must completed all input for create a note",
        status: 400,
      };
    }

    const newNote = new Note({
      userId: req.user._id,
      meetingType: meetingType,
      meetingDate: meetingDate,
      meetingObject: meetingObject,
      participants: participants,
      noteContent: noteContent,
    });
    console.log(newNote);

    req.user.notes.push(newNote._id);
    await newNote.save();
    await req.user.save();

    return res
      .status(201)
      .json({ message: "The note has been created successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
});

//Read
//récupération d'une note par son ID
router.get("/note/:id", auth, async (req, res) => {
  try {
    console.log(req.params.id);
    //récupération de la note
    const note = await Note.findById(req.params.id);
    console.log("noteFind", note);
    if (!note) {
      throw {
        message: "Note not found",
        status: 404,
      };
    }

    if (req.user._id !== note.userId) {
    } else {
      throw {
        message: "You not autorize to read this note",
        status: 401,
      };
    }

    return res.status(200).json(note);
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
});
//récupération des notes par ID user
router.get("/notes", auth, async (req, res) => {
  try {
    console.log(req.user);
    await req.user.populate("notes");
    return res
      .status(200)
      .json({ count: req.user.notes.length, notes: req.user.notes });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
});
//Update
router.put("/note/:id", auth, async (req, res) => {
  try {
    console.log(req.params.id);
    //récupération de la note
    const note = await Note.findById(req.params.id);
    console.log("noteFind", note);

    if (!note) {
      throw {
        message: "Note not found",
        status: 404,
      };
    }
    //vérifier autorisation de lecture
    if (req.user._id !== note.userId) {
    } else {
      throw {
        message: "You not autorize to read this note",
        status: 401,
      };
    }

    //mise à jour de la note via Object.assign

    const {
      meetingType,
      meetingDate,
      meetingObject,
      participants,
      noteContent,
    } = req.body;

    Object.assign(note, {
      meetingType,
      meetingDate,
      meetingObject,
      participants,
      noteContent,
    });

    await note.save();
    return res.status(200).json(note);
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
});

//Delete --> pas encore de middleware
router.delete("/note/:id", auth, async (req, res) => {
  try {
    //vérifier autorisation de delete
    if (
      req.user.notes.indexOf(new mongoose.Types.ObjectId(req.params.id)) === -1
    ) {
      throw {
        message: "You not autorize to deleted this note",
        status: 401,
      };
    }
    // console.log(req.params.id);
    //récupération de la note et suppression
    const result = await Note.findByIdAndDelete(req.params.id);

    if (result.deletedCount === 0) {
      throw { message: "Delete failed", status: 400 };
    }

    req.user.notes.pull(new mongoose.Types.ObjectId(req.params.id));
    await req.user.save();

    return res.status(200).json({ message: "Note successfully deleted" });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
});
module.exports = router;
