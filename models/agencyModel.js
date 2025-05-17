const mongoose = require("mongoose");
const agencySchema = mongoose.Schema(
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
    ContactInformation: {
      type: String,
      required: true,
    },
    Location: {
      type: String,
      required: true,
    },
    YearsInOperation: {
      type: Number,
      required: true,
    },
    ServicesOffered: {
      type: String,
      required: true,
    },
    ClientsRepresented: {
      type: String,
      required: true,
    },
    NumberOfDealsClosed: {
      type: Number,
      required: true,
    },
    TotalContractValue: {
      type: Number,
      required: true,
    },
    TargetClients: {
      type: [String],
      required: true,
    },
    FeeStructure: {
      type: String,
      required: true,
    },
    ClientSatisfactionRate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Agency", agencySchema);
