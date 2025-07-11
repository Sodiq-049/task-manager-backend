const mongoose = require("mongoose");

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: "Member" },
});

module.exports = mongoose.model("TeamMember", TeamMemberSchema);
