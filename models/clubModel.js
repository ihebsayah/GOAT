const mongoose = require("mongoose");
const clubSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    ClubName: {
      type: String,
      required: true,
    },
    StadiumCapacity: {
      type: Number,
      required: true,
    },
    NetWorthEUR: {
      type: Number, // Stored as full number in euros
      required: true,
    },
    YouthAcademyRating: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    TransferBudgetEUR: {
      type: Number,
      required: true,
    },
    ManagerialStability: {
      type: Number,
      required: true,
    },
    PlayingStyle: {
      type: Number,
      required: true,
    },
    InjuryRecords: {
      type: Number,
      required: true,
    },
    FanBaseSize: {
      type: Number, // In millions, but stored as full number
      required: true,
    },
    Rank: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Club", clubSchema);
