
// import { askAiDoctor } from '../controllers/aiDoctorController.js';
const {askAiDoctor}=require('../controllers/aiDoctorController.js')


const express = require("express");
const router = express.Router();

// POST /ai-doctor
router.post('/ai-doctor', askAiDoctor);

module.exports = router;