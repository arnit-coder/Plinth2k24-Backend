const express = require("express");
const { verification, isUser } = require("../controllers/Auth");
const { createTeam } = require("../controllers/Team");

const router = express.Router();

router.post('/createTeam', verification, isUser, createTeam)
router.delete('/deleteTeam', verification, isUser, deleteTeam)

module.exports = router;
