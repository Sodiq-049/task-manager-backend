const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  account: {
    fullName: String,
    username: String,
    email: String,
    enable2FA: Boolean,
    profilePic: String,
  },
  workspace: {
    workspaceName: String,
    defaultPriority: String,
    customField: String,
    publicTaskSharing: Boolean,
    workspaceLogo: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Settings", SettingsSchema);
