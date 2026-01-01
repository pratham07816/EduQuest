const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");

router.get("/", async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
});

module.exports = router;
