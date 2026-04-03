const Booking = require("../models/bookingModel");

// ✅ Create a new booking
const createBooking = async (req, res) => {
  try {
    const savedBooking = await Booking.create(req.body);

    res.status(201).json({
      message: "Booking created successfully",
      data: savedBooking
    });
  } catch (err) {
    res.status(500).json({
      err: err.message || err
    });
  }
};

// ✅ Get all bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user_id") // populate user details
      .populate("pg_id");  // populate PG details

    res.status(200).json({
      message: "Bookings fetched successfully",
      data: bookings
    });
  } catch (err) {
    res.status(500).json({
      err: err.message || err
    });
  }
};

// ✅ Update a booking by ID
const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return the updated document
    );

    res.status(200).json({
      message: "Booking updated successfully",
      data: updatedBooking
    });
  } catch (err) {
    res.status(500).json({
      err: err.message || err
    });
  }
};

// ✅ Delete a booking by ID
const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Booking deleted successfully",
      data: deletedBooking
    });
  } catch (err) {
    res.status(500).json({
      err: err.message || err
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
};