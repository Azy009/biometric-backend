const User = require('../models/User');
const path = require('path');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, contact, bankName } = req.body;
    
    if (!req.files || !req.files.aadhar || !req.files.pan || !req.files.fingerprint) {
      return res.status(400).json({ error: 'All documents (Aadhar, PAN, and Fingerprint) are required' });
    }

    const user = new User({
      name,
      email,
      contact,
      bankName,
      aadhar: req.files.aadhar[0].path,
      pan: req.files.pan[0].path,
      fingerprint: req.files.fingerprint[0].path
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search parameter
    const search = req.query.search || '';

    // Build query for search
    let query = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { contact: searchRegex },
          { bankName: searchRegex }
        ]
      };
    }

    // Get users with pagination and search
    const users = await User.find(query)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
