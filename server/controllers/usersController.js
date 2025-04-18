// server/controllers/userController.js
const User = require('../models/User');

// GET /api/admin/users
// Return all users (omit password & __v)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -__v')
      .lean();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error fetching users.' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;
    const newUser = new User({ name, email, password, role, status });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error creating user.' });
  }
}
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -__v')
      .lean();
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ message: 'Server error fetching user.' });
  }
};

// (Optional) PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, status },
      { new: true }
    ).select('-password -__v');
    if (!updated) return res.status(404).json({ message: 'User not found.' });
    res.json(updated);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error updating user.' });
  }
};

// (Optional) DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error deleting user.' });
  }
};
