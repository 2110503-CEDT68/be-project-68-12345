const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    checkInDate: {
        type: Date,
        required: [true, 'Please add a check-in date']
    },
    numberOfNights: {
        type: Number,
        required: [true, 'Please add number of nights'],
        min: [1, 'Number of nights must be at least 1'],
        max: [3, 'Number of nights cannot exceed 3']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    hotel: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hotel',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);