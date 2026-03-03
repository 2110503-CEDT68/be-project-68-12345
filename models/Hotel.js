const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a hotel name'],
        unique: true,
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    telephone: {
        type: String,
        required: [true, 'Please add a telephone number']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

HotelSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'hotel',
    justOne: false
});

module.exports = mongoose.model('Hotel', HotelSchema);