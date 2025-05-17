const mongoose = require("mongoose");
const gynmSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    GymName: {
      type: String,
      required: true,
    },
    Location: {
      type: String,
      required: true,
    },
    GymType: {
      type: String,
      required: true,
    },
    MembershipCapacity: {
      type: Number,
      required: true,
    },
    RegisteredPlayers: {
      type: String, // Convert from comma-separated string to array
      required: true,
    },
    CoachesAndTrainers: {
      type: String, // Convert from comma-separated string to array
      required: true,
    },
    EquipmentProvided: {
      type: String,
      required: true,
    },
    AffiliatedClubs: {
      type: String,
      required: true,
    },
    CollaboratedClubs: {
      type: String,
      required: true,
    },
    MembershipFees: {
      type: Number,
      required: true,
    },
    ContactInfo: {
      type: String,
      required: true,
    },
    FacilitySize: {
      type: Number, // In square meters or feet? (specify if needed)
      required: true,
    },
    AdditionalServices: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Gym", gynmSchema);
