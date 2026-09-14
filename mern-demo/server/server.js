const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Cho phép tất cả các tên miền/cổng gọi API (Fix triệt để lỗi CORS)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Đã kết nối MongoDB Atlas'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Import Model
const Student = require('./models/Student');D
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Thêm sinh viên mới
app.post('/api/students', async (req, res) => {
  try {
    const { code, name, email } = req.body;
    const newStudent = new Student({ code, name, email });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API Xóa sinh viên bằng mã sinh viên
app.delete('/api/students/code/:code', async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({
      $or: [{ code: req.params.code }, { studentId: req.params.code }]
    });
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Không tìm thấy mã sinh viên' });
    }
    res.json({ message: 'Đã xóa sinh viên', code: req.params.code });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API Xóa sinh viên bằng MongoDB ID
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Không tìm thấy sinh viên' });
    }
    res.json({ message: 'Đã xóa sinh viên' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));