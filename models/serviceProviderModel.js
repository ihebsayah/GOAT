const mongoose = require("mongoose");
const serviceProviderSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    ProviderName: {
      type: String,
      required: true,
    },
    ServiceType: {
      type: String,
      required: true,
    },
    Location: {
      type: String,
      required: true,
    },
    YearsInOperation: {
      type: String,
      required: true,
    },
    ClientPortfolio: {
      type: String,
      required: true,
    },
    Accreditations: {
      type: String,
      required: true,
    },
    ServiceCapacity: {
      type: String,
      required: true,
    },
    PricingModel: {
      type: String,
      required: true,
    },
    TechnologyUtilized: {
      type: String,
      required: true,
    },
    PerformanceMetrics: {
      type: String,
      required: true,
    },
    ComplianceStandards: {
      type: String,
      required: true,
    },
    ContactInformation: {
      type: String,
      required: true,
    },
    Availability: {
      type: String,
      required: true,
    },
    Testimonials: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("ServiceProvider", serviceProviderSchema);
