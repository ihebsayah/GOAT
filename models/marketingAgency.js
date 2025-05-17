const mongoose = require("mongoose");
const marketingAgencySchema = mongoose.Schema(
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
    Location: {
      type: String,
      required: true,
    },
    Industry: {
      type: String,
      required: true,
    },
    ClientName: {
      type: String,
      required: true,
    },
    Website: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    PhoneNumber: {
      type: String,
      required: true,
    },
    CEOName: {
      type: String,
      required: true,
    },
    FoundedYear: {
      type: Number,
      required: true,
    },
    EmployeesCount: {
      type: Number,
      required: true,
    },
    SocialMediaPresence: {
      type: String,
      required: true,
    },
    ServicesOffered: {
      type: String, // Parsed from comma-separated string
      required: true,
    },
    AnnualRevenueUSD: {
      type: Number,
      required: true,
    },
    NumberOfCampaignsRun: {
      type: Number,
      required: true,
    },
    CustomerSatisfactionRating: {
      type: Number,
      required: true,
    },
    AwardsWon: {
      type: Number,
      required: true,
    },
    Specialization: {
      type: String,
      required: true,
    },
    ClientType: {
      type: String,
      required: true,
    },
    KeyFocusArea: {
      type: String,
      required: true,
    },
    MonthlyMarketingBudgetUSD: {
      type: Number,
      required: true,
    },
    KeyIndustriesServed: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("MarketingAgency", marketingAgencySchema);
