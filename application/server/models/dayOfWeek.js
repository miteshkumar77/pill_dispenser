const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const dayOfWeekSchema = new Schema({
    _id: String,
    medicineIds: [String]
});

module.exports = mongoose.model('DayOfWeek', dayOfWeekSchema); 