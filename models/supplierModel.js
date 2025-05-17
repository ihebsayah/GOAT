const mongoose = require("mongoose");
const supplierSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    supplierName: {
      type: String,
      required: true,
    },
    productRange: {
      type: String,
      required: true,
    },
    brandReputation: {
      type: String,
      required: true,
    },
    deliveryAndLogistics: {
      type: String,
      required: true,
    },
    productQuality: {
      type: String,
      required: true,
    },
    eCommerceAndDistribution: {
      type: String,
      required: true,
    },
    customizationAndPersonalization: {
      type: String,
      required: true,
    },
    sponsorshipAndPartnershipDeals: {
      type: String,
      required: true,
    },
    pricingAndDiscounts: {
      type: String,
      required: true,
    },
    collaboratedClubs: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Supplier", supplierSchema);
