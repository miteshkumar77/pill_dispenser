const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const dayOfWeekSchema = new Schema({
    _id: String
});

module.exports = mongoose.model('DayOfWeek', dayOfWeekSchema); 