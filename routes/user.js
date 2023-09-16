const express = require("express");
const { verification } = require("../controllers/Auth");
const { UserDetailsUpdate } = require("../controllers/UserDashboard");
const router = express.Router();

router.post('/updateDashboard', verification, UserDetailsUpdate)

module.exports = router;
