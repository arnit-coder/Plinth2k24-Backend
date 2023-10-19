const express = require("express");
const { verification, isAdmin } = require("../controllers/Auth");
const {
  CreateCompetition,
  FetchAllCompetition,
  UpdateCompetition,
} = require("../controllers/Competition");
const router = express.Router();

router.post("/createCompetition", verification, isAdmin, CreateCompetition);
router.get("/fetchAllCompetition", verification, FetchAllCompetition);
router.post("/updateCompetition", verification, isAdmin, UpdateCompetition);

module.exports = router;
