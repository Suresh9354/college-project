const express = require('express');
const router = express.Router();

const {
  createNotice,
  getAllNotices,
  getNoticesByRole,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');

const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');

// 🔒 Admin can create a notice
router.post('/', verifyToken, verifyRole('admin'), createNotice);

// 🔒 Admin can update and delete
router.put('/:id', verifyToken, verifyRole('admin'), updateNotice);
router.delete('/:id', verifyToken, verifyRole('admin'), deleteNotice);

// 🔓 Get all notices for Admin (ALL, STAFF, STUDENT)
router.get('/', verifyToken, verifyRole('admin'), getAllNotices);

// 🔓 Get filtered notices for Student or Staff (only allowed for staff/student)
router.get('/user', verifyToken, getNoticesByRole);

module.exports = router;
