const express = require("express");
const { verification, isUser } = require("../controllers/Auth");
const { UserDetailsUpdate } = require("../controllers/UserDashboard");
const router = express.Router();

router.post('/updateDashboard', verification, isUser, UserDetailsUpdate)

module.exports = router;
