const Booking = require("../models/bookingsModel");
const Bus = require("../models/busModel");
const User = require("../models/usersModel");
const { CreateNotification } = require("./notificationController");

const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
require("dotenv").config();
const moment = require("moment");

// nodemailer transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// book seat and send email to user with the booking details
const BookSeat = async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body, // spread operator to get all the data from the request body
      user: req.params.userId,
    });
    const user = await User.findById(req.params.userId);
    // res.json(user._id)
    await newBooking.save();
    const bus = await Bus.findById(req.body.bus); // get the bus from the request body
    bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats]; // add the booked seats to the bus seatsBooked array in the database

    await bus.save();
    // send email to user with the booking details
    let mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Booking Details",
      text: `Hello ${user.name}, your booking details are as follows:
      Bus: ${bus.name}
      Seats: ${req.body.seats}
      Departure Time: ${moment(bus.departure, "HH:mm:ss").format("hh:mm A")}
      Arrival Time: ${moment(bus.arrival, "HH:mm:ss").format("hh:mm A")}
      Journey Date: ${bus.journeyDate}
      Total Price: ${bus.price * req.body.seats.length} MAD
      Thank you for choosing us! 
      `,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Error Occurs", err);
      } else {
        console.log("Email sent!!!");
      }
    });
    // Create notification for successful booking
    try {
      await CreateNotification(user._id, {
        type: "booking",
        title: "Booking Confirmed!",
        message: `Your booking for ${bus.name} from ${bus.from} to ${bus.to} has been confirmed. Seats: ${req.body.seats.join(', ')}`,
        data: {
          bookingId: newBooking._id,
          busId: bus._id,
          seats: req.body.seats
        }
      });
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
    }

    res.status(200).send({
      message: "Seat booked successfully",
      data: newBooking,
      user: user._id,
      success: true,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Booking failed",
      data: error,
      success: false,
    });
  }
};

const GetAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("bus").populate("user");
    res.status(200).send({
      message: "All bookings",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to get bookings",
      data: error,
      success: false,
    });
  }
};

const GetAllBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.user_Id }).populate([
      "bus",
      "user",
    ]);
    res.status(200).send({
      message: "Bookings fetched successfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
};

// cancel booking by id and remove the seats from the bus seatsBooked array
const CancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.booking_id);
    const user = await User.findById(req.params.user_id);
    const bus = await Bus.findById(req.params.bus_id);
    if (!booking || !user || !bus) {
      res.status(404).send({
        message: "Booking not found",
        data: error,
        success: false,
      });
    }

    // Create notification for booking cancellation
    try {
      await CreateNotification(user._id, {
        type: "system",
        title: "Booking Cancelled",
        message: `Your booking for ${bus.name} from ${bus.from} to ${bus.to} has been cancelled. Seats: ${booking.seats.join(', ')}`,
        data: {
          bookingId: booking._id,
          busId: bus._id,
          seats: booking.seats
        }
      });
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
    }

    booking.remove();
    bus.seatsBooked = bus.seatsBooked.filter(
      (seat) => !booking.seats.includes(seat)
    );
    await bus.save();
    res.status(200).send({
      message: "Booking cancelled successfully",
      data: booking,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Booking cancellation failed",
      data: error,
      success: false,
    });
  }
};

module.exports = {
  BookSeat,
  GetAllBookings,
  GetAllBookingsByUser,
  CancelBooking,
};
