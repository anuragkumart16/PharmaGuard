const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // We store the entire response JSON object returned by the PGx engine
    reportData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.History || mongoose.model("History", HistorySchema);
