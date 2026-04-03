const router = require("express").Router();
const bookingController = require("../controller/bookingController");

// ✅ Create a new booking
router.post("/booking", bookingController.createBooking);

// ✅ Get all bookings
router.get("/bookings", bookingController.getBookings);

// ✅ Update a booking by ID
router.put("/booking/:id", bookingController.updateBooking);

// ✅ Delete a booking by ID
router.delete("/booking/:id", bookingController.deleteBooking);

module.exports = router;