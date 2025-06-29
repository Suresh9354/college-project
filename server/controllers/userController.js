const User = require('../models/user'); // ✅ Correct import (uppercase "U")

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Get all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('❌ Error in deleteUser:', err);
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Optional: check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = await User.create({ name, email, role, password: 'password123' }); // default password
    res.status(201).json(newUser);
  } catch (err) {
    console.error('❌ Error creating user:', err);
    res.status(500).json({ message: 'Failed to add user' });
  }
};

exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const total = await User.countDocuments();
    const users = await User.find().skip(skip).limit(limit);
    return res.status(200).json({ total, users });
  } catch (err) {
    console.error('Pagination error:', err);
    return res.status(500).json({ msg: 'Pagination failed' });
  }
};