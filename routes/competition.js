const express = require("express");
const { verification, isAdmin } = require("../controllers/Auth");
const { CreateCompetition, FetchAllCompetition } = require("../controllers/Competition");
const router = express.Router();

router.post('/createCompetition', verification, isAdmin, CreateCompetition);
router.get('/fetchAllCompetition', FetchAllCompetition);

module.exports = router;
