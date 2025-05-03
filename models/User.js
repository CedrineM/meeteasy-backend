const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  token: { type: String, required: true },
  apiUsage: { type: Number, default: 0 },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
