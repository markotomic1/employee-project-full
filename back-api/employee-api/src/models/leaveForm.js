const mongoose = require("mongoose");

const leaveFormSchema = new mongoose.Schema({
  "Reason for leave": {
    type: String,
    required: true,
  },
  "User identifier": {
    type: String,
  },
  "Date of creation": {
    type: Date,
    required: true,
  },
  "Leave type": {
    type: String,
    required: true,
  },
  "Start date of leave": {
    type: Date,
    required: true,
  },
  "End date of leave": {
    type: Date,
    required: true,
  },
  "Count of working days between set dates": {
    type: Number,
  },
  state: {
    type: String,
    enum: ["Pending", "Approved", "Cancelled"],
    default: "Pending",
  },
});

leaveFormSchema.virtual("userIdentifier").get(function () {
  return this.get("User identifier");
});

const LeaveForm = mongoose.model("LeaveForm", leaveFormSchema);
module.exports = LeaveForm;
