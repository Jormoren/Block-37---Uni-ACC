const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser } = require('../db'); // Adjust the path if necessary

const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  try {
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const userId = await createUser(firstName, lastName, username, password);
    res.status(201).json({ userId });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
