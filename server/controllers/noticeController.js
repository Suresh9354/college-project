const Notice = require('../models/Notice');

// ✅ Create Notice
exports.createNotice = async (req, res) => {
  try {
    const { title, message, audience } = req.body;

    if (!title || !message || !audience) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const notice = new Notice({
      title,
      message,
      audience,
      createdBy: req.user?.id || 'admin',
    });

    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    console.error("Error creating notice:", err);
    res.status(500).json({ message: 'Failed to create notice' });
  }
};

// ✅ Get All Notices (For Admin)
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (err) {
    console.error("Error fetching all notices:", err);
    res.status(500).json({ message: 'Error fetching notices' });
  }
};

// ✅ Get Notices by User Role (Staff / Student)
exports.getNoticesByRole = async (req, res) => {
  try {
    const role = req.user.role;
    const notices = await Notice.find({
      $or: [
        { audience: 'all' },
        { audience: role },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(notices);
  } catch (err) {
    console.error("Error fetching role-based notices:", err);
    res.status(500).json({ message: 'Failed to fetch notices' });
  }
};

// ✅ Update Notice
exports.updateNotice = async (req, res) => {
  const { id } = req.params;
  const { title, message, audience } = req.body;

  try {
    const updated = await Notice.findByIdAndUpdate(
      id,
      { title, message, audience },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Notice not found' });

    res.json(updated);
  } catch (err) {
    console.error("Error updating notice:", err);
    res.status(500).json({ message: 'Failed to update notice' });
  }
};

// ✅ Delete Notice
exports.deleteNotice = async (req, res) => {
  try {
    const deleted = await Notice.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Notice not found' });

    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    console.error("Error deleting notice:", err);
    res.status(500).json({ message: 'Error deleting notice' });
  }
};
