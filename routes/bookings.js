const express = require('express');
const { getBookings, getBooking, addBooking, updateBooking, deleteBooking } = require('../controllers/bookings');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - checkInDate
 *         - numberOfNights
 *         - hotel
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated booking ID
 *         checkInDate:
 *           type: string
 *           format: date
 *           description: Check-in date
 *         numberOfNights:
 *           type: integer
 *           minimum: 1
 *           maximum: 3
 *           description: Number of nights (max 3)
 *         user:
 *           type: string
 *           description: User ID who made the booking
 *         hotel:
 *           type: string
 *           description: Hotel ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: 60d5ec49f1b2c72b8c8e4f1b
 *         checkInDate: "2024-12-25"
 *         numberOfNights: 2
 *         user: 60d5ec49f1b2c72b8c8e4f1c
 *         hotel: 60d5ec49f1b2c72b8c8e4f1a
 */

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Hotel booking management
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     description: Regular users see only their bookings, admins see all bookings
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Not authorized
 */
router.route('/')
    .get(protect, getBookings)
    .post(protect, authorize('admin', 'user'), addBooking);

/**
 * @swagger
 * /hotels/{hotelId}/bookings:
 *   get:
 *     summary: Get bookings for a specific hotel
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: List of bookings for the hotel
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Hotel not found
 *   post:
 *     summary: Create a booking for a hotel
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - checkInDate
 *               - numberOfNights
 *             properties:
 *               checkInDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-25"
 *               numberOfNights:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3
 *                 example: 2
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error (e.g., nights > 3)
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Hotel not found
 */

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not booking owner
 *       404:
 *         description: Booking not found
 *   put:
 *     summary: Update booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     description: Users can only update their own bookings, admins can update any
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               checkInDate:
 *                 type: string
 *                 format: date
 *               numberOfNights:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 3
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not booking owner
 *       404:
 *         description: Booking not found
 *   delete:
 *     summary: Delete booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     description: Users can only delete their own bookings, admins can delete any
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Not booking owner
 *       404:
 *         description: Booking not found
 */
router.route('/:id')
    .get(protect, getBooking)
    .put(protect, authorize('admin', 'user'), updateBooking)
    .delete(protect, authorize('admin', 'user'), deleteBooking);

module.exports = router;
