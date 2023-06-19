const express = require("express");
const router = express.Router();
const { createCompany } = require("../controllers/company");
const { adminAuthHandler } = require("../middleware/authHandler");

router.post("/", adminAuthHandler, createCompany);

module.exports = router;
