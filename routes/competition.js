const express = require("express");
const { verification, isAdmin } = require("../controllers/Auth");
const { CreateCompetition } = require("../controllers/Competition");
const router = express.Router();

router.post('/createCompetition', verification, isAdmin, CreateCompetition);

module.exports = router;
