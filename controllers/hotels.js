const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

exports.getHotels = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryString = JSON.stringify(reqQuery);
        queryString = queryString.replace(/\b(gt|gte|lt|lte|in|ne)\b/g, match => `$${match}`);

        query = Hotel.find(JSON.parse(queryString)).populate('bookings');

        // Select fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Hotel.countDocuments();

        query = query.skip(startIndex).limit(limit);

        const hotels = await query;

        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: hotels.length,
            pagination,
            data: hotels
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        res.status(200).json({
            success: true,
            data: hotel
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.createHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.create(req.body);

        res.status(201).json({
            success: true,
            data: hotel
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.updateHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        res.status(200).json({
            success: true,
            data: hotel
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

exports.deleteHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        await Booking.deleteMany({ hotel: req.params.id });
        await Hotel.deleteOne({ _id: req.params.id });

        res.status(200).json({
            success: true,
            data: {}
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
