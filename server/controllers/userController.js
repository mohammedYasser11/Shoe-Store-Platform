const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name)    updates.name    = req.body.name;
    if (req.body.phone)   updates.phone   = req.body.phone;
    if (req.body.address) {
      const addr = req.body.address;
      if (addr.country) updates['address.country'] = addr.country;
      if (addr.city)    updates['address.city']    = addr.city;
      if (addr.zip)     updates['address.zip']     = addr.zip;
      if (addr.street)  updates['address.street']  = addr.street;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
