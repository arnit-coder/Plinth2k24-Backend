const express = require("express");
const { verification, isAdmin } = require("../controllers/Auth");
const {
  CreateCompetition,
  FetchAllCompetition,
  UpdateCompetition,
} = require("../controllers/Competition");
const router = express.Router();

router.post("/createCompetition", CreateCompetition);
router.get("/fetchAllCompetition", FetchAllCompetition);
router.post("/updateCompetition", verification, isAdmin, UpdateCompetition);

module.exports = router;
