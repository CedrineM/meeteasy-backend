//import des packages

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//import des modèles
const Note = require("../models/Note");
const User = require("../models/User");

//CRUD
//Create
//route création d'une note
router.post("/note", async (req, res) => {
  try {
    // console.log(req.body, req.headers.authorization);

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
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });
    // console.log(user);
    const newNote = new Note({
      userId: user._id,
      meetingType: meetingType,
      meetingDate: meetingDate,
      meetingObject: meetingObject,
      participants: participants,
      noteContent: noteContent,
    });
    console.log(newNote);

    user.notes.push(newNote._id);
    await newNote.save();
    await user.save();

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
router.get("/note/:id", async (req, res) => {
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
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    }).populate("notes");

    if (!user) {
      throw {
        message: "This user not existe",
        status: 401,
      };
    }
    // console.log("tabNotes", user.notes);

    if (user._id !== note.userId) {
    } else {
      throw {
        message: "You not autorize to modify this note",
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
router.get("/notes", async (req, res) => {
  try {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    }).populate("notes");
    const notesUser = await Note.find({ userId: user._id });
    console.log(notesUser);
    return res.status(200).json({ count: notesUser.length, notes: notesUser });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
});
//Update
router.put("/note/:id", async (req, res) => {
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
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    }).populate("notes");

    if (!user) {
      throw {
        message: "This user not existe",
        status: 401,
      };
    }
    // console.log("tabNotes", user.notes);

    if (user._id !== note.userId) {
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
router.delete("/note/:id", async (req, res) => {
  try {
    // quand middleware et vérification d'autorisation utiliser seulement findone and delete

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
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    }).populate("notes");

    if (!user) {
      throw {
        message: "This user not existe",
        status: 401,
      };
    }
    // console.log("tabNotes", user.notes);

    if (!user._id.equals(note.userId)) {
      throw {
        message: "You are not authorized to delete this note",
        status: 401,
      };
    }

    // Suppression de la note
    const result = await Note.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      throw { message: "Delete failed", status: 400 };
    }

    await user.updateOne({
      $pull: { notes: new mongoose.Types.ObjectId(req.params.id) },
    });

    return res.status(200).json({ message: "Note successfully deleted" });
  } catch (error) {
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
});
module.exports = router;
