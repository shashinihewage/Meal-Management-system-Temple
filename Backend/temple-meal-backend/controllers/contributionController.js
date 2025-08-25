const Contribution = require('../models/Contribution');

// Get all contributions for the logged-in user
const getContributions = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware

    const contributions = await Contribution.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(contributions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add a new contribution by the logged-in user
const addContribution = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const { title, description, amount, date } = req.body;

    if (!title || !amount || !date) {
      return res.status(400).json({ message: 'Title, amount, and date are required' });
    }

    const newContribution = new Contribution({
      user: userId,
      title,
      description: description || '',
      amount,
      date,
    });

    await newContribution.save();

    res.status(201).json({ message: 'Contribution added successfully', contribution: newContribution });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getContributions,
  addContribution,
};
