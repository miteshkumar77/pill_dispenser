const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const medicineSchema = new Schema({
    id: String,
    count: Number,
    name: String,
    times: [Number],
    dayNames: [String]
});

module.exports = mongoose.model('Medicine', medicineSchema);