const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  meetingType: { type: String, required: true },
  meetingDate: { type: String, required: true },
  meetingObject: { type: String, required: true },
  participants: [],
  noteContent: [],
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
