const express = require("express");
const { verification, isAdmin } = require("../controllers/Auth");
const {
  CreateCompetition,
  FetchAllCompetition,
  UpdateCompetition,
  DeleteCompetition,
} = require("../controllers/Competition");
const router = express.Router();

router.post("/createCompetition", CreateCompetition); //, verification, isAdmin
router.get("/fetchAllCompetition", FetchAllCompetition);
router.post("/updateCompetition", verification, isAdmin, UpdateCompetition);
router.post('/deleteCompetition', verification, isAdmin, DeleteCompetition)

module.exports = router;
