
// routes/user.routes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');

// Registe
router.post('/register', userController.register);
router.post('/login', userController.login);// Login
router.get('/logout', userController.logout); // Logout endpoint



module.exports = router;