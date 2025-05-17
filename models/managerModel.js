const mongoose = require("mongoose");
const managerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    FullName: {
      type: String,
      required: true,
    },
    Age: {
      type: Number,
      required: true,
    },
    Nationality: {
      type: String,
      required: true,
    },
    CurrentClub: {
      type: String,
      required: true,
    },
    League: {
      type: String,
      required: true,
    },
    YearsOfExperience: {
      type: Number,
      required: true,
    },
    WinPercentage: {
      type: Number,
      required: true,
    },
    TotalMatchesManaged: {
      type: Number,
      required: true,
    },
    TrophiesWon: {
      type: Number,
      required: true,
    },
    PreferredFormation: {
      type: String,
      required: true,
    },
    AttackingStyle: {
      type: String,
      required: true,
    },
    DefensiveStyle: {
      type: String,
      required: true,
    },
    ContractExpiryDate: {
      type: Date,
      required: true,
    },
    PreviousClubsManaged: {
      type: String, // Can be expanded to array if more clubs are added
      required: true,
    },
    SalaryAnnualEUR: {
      type: Number, // Stored in euros as full number
      required: true,
    },
    FIFAManagerRating: {
      type: Number,

      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Manager = mongoose.model("Manager", managerSchema);
module.exports = Manager;
