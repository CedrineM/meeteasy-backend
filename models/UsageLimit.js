const mongoose = require("mongoose");

const usageLimitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  count: { type: Number, default: 0 },
  resetAt: {
    type: Date,
    default: () => new Date(new Date().setMonth(new Date().getMonth() + 1)),
  },
});

const UsageLimit = mongoose.model("UsageLimit", usageLimitSchema);
module.exports = UsageLimit;
