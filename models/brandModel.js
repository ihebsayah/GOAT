const mongoose = require("mongoose");
const brandSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    Brand: {
      type: String,
      required: true,
    },
    SponsoredClub: {
      type: String,
      required: true,
    },
    AnnualRevenueUSD: {
      type: String, // Kept as string to preserve "33.45B" format
      required: true,
    },
    ContractDuration: {
      type: String, // If this is a string like "2029–2040"
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Brand", brandSchema);
