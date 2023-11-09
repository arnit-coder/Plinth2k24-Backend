const mongoose = require("mongoose");

// Define a schema for the competition model
const competitionSchema = new mongoose.Schema({
  clubOrganizingName: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  nameOfCompetition: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  soloOrTeam: {
    type: String,
    enum: ["Solo", "Team"],
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  prize: {
    type: String,
    required: true,
  },
  rulebook: {
    type: String,
  },
  minTeamMembers: {
    type: Number
  },
  maxTeamMembers: {
    type: Number
  },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  ],
});

module.exports = mongoose.model("Competition", competitionSchema);
