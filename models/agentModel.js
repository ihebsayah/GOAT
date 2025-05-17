const e = require("express");
const mongoose = require("mongoose");
const agentSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    Name: {
      type: String,
      required: true,
    },
    AgencyName: {
      type: String,
      required: true,
    },
    ContactInformation: {
      type: String,
      required: true,
    },
    Location: {
      type: String,
      required: true,
    },
    YearsOfExperience: {
      type: Number,
      required: true,
    },
    Specialization: {
      type: String,
      required: true,
    },
    PlayersRepresented: {
      type: String,
      required: true,
    },
    NumberOfDealsClosed: {
      type: Number,
      required: true,
    },
    TotalTransferValue: {
      type: Number,
      required: true,
    },
    TargetPlayers: {
      type: String,
      required: true,
    },
    CommissionStructure: {
      type: String,
      required: true,
    },
    FeedbackRating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Agent", agentSchema);
