const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');

exports.getBookings = async (req, res, next) => {
    let query;

    if (req.user.role !== 'admin') {
        query = Booking.find({ user: req.user.id }).populate({
            path: 'hotel',
            select: 'name address telephone'
        });
    } else {
        if (req.params.hotelId) {
            query = Booking.find({ hotel: req.params.hotelId }).populate({
                path: 'hotel',
                select: 'name address telephone'
            });
        } else {
            query = Booking.find().populate({
                path: 'hotel',
                select: 'name address telephone'
            });
        }
    }

    try {
        const bookings = await query;

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot find bookings'
        });
    }
};

exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate({
            path: 'hotel',
            select: 'name address telephone'
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking with the id of ${req.params.id}`
            });
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: `User ${req.user.id} is not authorized to view this booking`
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot find booking'
        });
    }
};

exports.addBooking = async (req, res, next) => {
    try {
        req.body.hotel = req.params.hotelId;
        const hotel = await Hotel.findById(req.params.hotelId);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: `No hotel with the id of ${req.params.hotelId}`
            });
        }

        if (req.body.numberOfNights > 3) {
            return res.status(400).json({
                success: false,
                message: 'Number of nights cannot exceed 3'
            });
        }

        req.body.user = req.user.id;

        const booking = await Booking.create(req.body);

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Cannot create booking'
        });
    }
};

exports.updateBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking with the id of ${req.params.id}`
            });
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this booking`
            });
        }

        if (req.body.numberOfNights && req.body.numberOfNights > 3) {
            return res.status(400).json({
                success: false,
                message: 'Number of nights cannot exceed 3'
            });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot update booking'
        });
    }
};

exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: `No booking with the id of ${req.params.id}`
            });
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this booking`
            });
        }

        await booking.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Cannot delete booking'
        });
    }
};
