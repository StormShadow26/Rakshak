

const User = require('../models/User.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// DiceBear URL generator (you can customize it as you like)
const generateAvatar = (firstname, lastname) => {
     return `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`;
};

exports.register = async (req, res) => {

     try {
          const { firstname, lastname, email, password, role } = req.body;
          console.log(req.body);
          // Check if user already exists
          const existingUser = await User.findOne({ email });
          if (existingUser) {
               return res.status(400).json({ message: 'Email already exists' });
          }

          // Hash password
          const hashedPassword = await bcrypt.hash(password, 10);

          // Generate token
          const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

          // Create avatar
          const image = `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`;

          // Save user
          const newUser = new User({ firstname, lastname, email, password: hashedPassword, role, token, image });
          await newUser.save();

          // Set token as a cookie
          res.cookie('token', token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production', // true in production
               sameSite: 'strict',
               maxAge: 24 * 60 * 60 * 1000 // 1 day
          });

          res.status(201).json({
               message: 'User registered successfully',
               user: {
                    firstname,
                    lastname,
                    email,
                    role,
                    image,
                    token
               }
          });

     } catch (error) {
          res.status(500).json({ message: 'Registration failed', error: error.message });
     }
};

exports.login = async (req, res) => {
     try {
          const { email, password } = req.body;

          const user = await User.findOne({ email });
          if (!user) return res.status(400).json({ message: 'Invalid credentials' });

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

          const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

          // Update token in DB
          user.token = token;
          await user.save();
          // Set token as a cookie
          res.cookie('token', token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production', // true in production
               sameSite: 'strict',
               maxAge: 24 * 60 * 60 * 1000 // 1 day
          });

          res.status(200).json({
               message: 'Login successful',
               user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image,
                    token: user.token,
                    _id:user._id
               }
          });

     } catch (error) {
          res.status(500).json({ message: 'Login failed', error: error.message });
     }
};

exports.logout = async (req, res) => {
     try {
          res.clearCookie("token", {
               httpOnly: true,
               sameSite: 'strict',
               secure: process.env.NODE_ENV === 'production'
          });
          res.status(200).json({ message: "Logout successful" });
     } catch (error) {
          res.status(500).json({ message: "Logout failed", error: error.message });
     }
};