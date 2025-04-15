const Message = require('../models/Message');

exports.submitMessage = async (req, res) => {
  const { name, email, message } = req.body;
  console.log('Incoming message:', { name, email, message });


  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newMessage = await Message.create({ name, email, message });
    res.status(201).json({ message: 'Message received.', data: newMessage });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
