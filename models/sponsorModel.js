const mongoose = require("mongoose");
const sponsorSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    industry: {
      type: Number,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    reputationScore: {
      type: Number,
      required: true,
    },
    marketingSupport: {
      type: String,
      required: true,
    },
    contractDuration: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    previousSponsorships: {
      type: String,
      required: true,
    },
    productRelevance: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Sponsor", sponsorSchema);
