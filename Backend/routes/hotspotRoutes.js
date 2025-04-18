const express = require("express");
const router = express.Router();
const { getHotspots } = require("../controllers/hotspotController");

router.get("/hotspots", getHotspots);

module.exports = router;
