const express = require("express");
const { verification, isUser, isAdmin } = require("../controllers/Auth");
const { createTeam, getAllTeams, deleteTeam } = require("../controllers/Team");

const router = express.Router();

router.post("/createTeam", verification, isUser, createTeam);
router.delete("/deleteTeam", verification, isUser, deleteTeam);
router.get("/getAllTeam", verification, isAdmin, getAllTeams);

module.exports = router;
