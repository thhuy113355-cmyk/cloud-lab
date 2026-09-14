const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
});
module.exports = mongoose.model('Student', studentSchema);
