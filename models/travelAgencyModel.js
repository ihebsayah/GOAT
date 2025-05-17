const mongoose = require("mongoose");
const travelAgencySchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    AgencyName: {
      type: String,
      required: true,
    },
    HeadquartersLocation: {
      type: String,
      required: true,
    },
    ListOfClubsServed: {
      type: String,
      required: true,
    },
    ListOfPlayersServed: {
      type: String,
      required: true,
    },
    FederationsAndAssociationsWorkedWith: {
      type: String,
      required: true,
    },
    PartnerAirlinesAndHotels: {
      type: String,
      required: true,
    },
    NumberOfTeamsManagedPerYear: {
      type: Number,
      required: true,
    },
    SportsEventTravelPackages: {
      type: String,
      required: true,
    },
    CollaboratedClubs: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("TravelAgency", travelAgencySchema);
