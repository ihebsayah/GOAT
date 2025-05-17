const mongoose = require("mongoose");
const playerSchema = mongoose.Schema(
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
    age: {
      type: Number,
      required: true,
    },
    height_cm: {
      type: Number,
      required: true,
    },
    weight_kgs: {
      type: Number,
      required: true,
    },
    value_euro: {
      type: Number,
      required: true,
    },
    wage_euro: {
      type: Number,
      required: true,
    },
    international_reputation: {
      type: Number,
      required: true,
    },
    body_type: {
      type: String,
      required: true,
    },
    release_clause_euro: {
      type: Number,
      required: true,
    },
    heading_accuracy: {
      type: Number,
      required: true,
    },
    acceleration: {
      type: Number,
      required: true,
    },
    sprint_speed: {
      type: Number,
      required: true,
    },
    reactions: {
      type: Number,
      required: true,
    },
    aggression: {
      type: Number,
      required: true,
    },
    interceptions: {
      type: Number,
      required: true,
    },
    vision: {
      type: Number,
      required: true,
    },
    penalties: {
      type: Number,
      required: true,
    },
    composure: {
      type: Number,
      required: true,
    },
    marking: {
      type: Number,
      required: true,
    },
    standing_tackle: {
      type: Number,
      required: true,
    },
    sliding_tackle: {
      type: Number,
      required: true,
    },
    age_group: {
      type: String,
      required: true,
    },
    performance_score: {
      type: Number,
      required: true,
    },
    skill_index: {
      type: Number,
      required: true,
    },
    physicality_index: {
      type: Number,
      required: true,
    },
    position_group: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Player", playerSchema);
