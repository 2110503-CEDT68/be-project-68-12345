const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    name : {
        type: String,
        require: [true, 'Please add name'],
        unique: true,
        trim: true,
        maxlenght: [50, 'Name cannot be more than 50 charector']
    },
    address: {
        type: String,
        require: [true, 'Please add an address']
    },
    district: {
        type: String,
        require: [true, 'Please add a district']
    },
    province: {
        type: String,
        require: [true, 'Please add a province']
    },
    postalcode: {
        type: String,
        require: [true, 'Please add a postalcode'],
        maxlenght: [5, 'Postalcode cannot be more than 5 digit']
    }
    ,
    tel: {
        type: String
    },
    region: {
        type: String,
        require: [true, 'Please add  a region']
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

HospitalSchema.virtual('appointments', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'hospital',
    justOne: false
});

module.exports = mongoose.model('Hospital', HospitalSchema);