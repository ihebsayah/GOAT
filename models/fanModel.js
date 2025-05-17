const mongoose = require("mongoose");
const fanSchema = mongoose.Schema(
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
    gender: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    favouriteTeam: {
      type: String,
      required: true,
    },
    favouritePlayer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Fan", fanSchema);
