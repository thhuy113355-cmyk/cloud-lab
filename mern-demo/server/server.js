const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Student = require('./models/Student.js');

const app = express();

app.use(cors());
app.use(express.json());

// Thêm route gốc để không bị lỗi Cannot GET /
app.get('/', (req, res) => {
  res.send('MERN Stack Backend API is running successfully!');
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Đã kết nối MongoDB Atlas'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { code, name, email } = req.body;
    const student = await Student.create({ code, name, email });
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/students/code/:code', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      $or: [
        { code: req.params.code },
        { studentId: req.params.code }
      ]
    });

    if (!student) {
      return res.status(404).json({ error: 'Không tìm thấy mã sinh viên' });
    }

    res.json({ message: 'Đã xóa sinh viên' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});