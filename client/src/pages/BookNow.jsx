import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { Row, Col, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import { getCapacityColors } from "../helpers/capacityColors";
import { Helmet } from "react-helmet";
import moment from "moment";
import { useNotifications } from "../contexts/NotificationContext";

function BookNow() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);
  const { refresh: refreshNotifications, fetchUnreadCount } = useNotifications();

  const getBus = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(`/api/buses/${params.id}`);
      dispatch(HideLoading());
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, params.id]);

  const bookNow = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        `/api/bookings/book-seat/${localStorage.getItem("user_id")}`,
        {
          bus: bus._id,
          seats: selectedSeats,
          transactionId: transactionId || "direct-booking",
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        // Refresh notifications so the bell updates immediately
        try {
          await fetchUnreadCount();
          // Optionally refresh list too
          refreshNotifications();
        } catch (e) {
          // Non-blocking
        }
        navigate("/bookings");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBus();
  }, [getBus]);

  const capacityInfo = bus ? getCapacityColors(bus.capacity, bus.seatsBooked) : null;

  return (
    <>
      <Helmet>
        <title>Book Now</title>
      </Helmet>

      <div className="p-4 sm:p-6 lg:p-10">
        {bus && (
          <Row gutter={[30, 30]}>
            {/* Left Side - Bus Info */}
            <Col lg={12} xs={24}>
              <div className="bg-white shadow-md rounded-2xl p-6 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-blue-600">{bus.name}</h1>
                  <p className="text-gray-700 text-lg font-medium">
                    {bus.from} → {bus.to}
                  </p>
                </div>

                <div className="grid gap-3 text-gray-700">
                  <p>
                    <span className="font-semibold text-blue-600">Journey Date:</span>{" "}
                    {bus.journeyDate}
                  </p>
                  <p>
                    <span className="font-semibold text-blue-600">Price:</span> ₹{bus.price}/-
                  </p>
                  <p>
                    <span className="font-semibold text-blue-600">Departure:</span>{" "}
                    {moment(bus.departure, "HH:mm").format("hh:mm A")}
                  </p>
                  <p>
                    <span className="font-semibold text-blue-600">Arrival:</span>{" "}
                    {moment(bus.arrival, "HH:mm").format("hh:mm A")}
                  </p>
                </div>

                {/* Capacity Info */}
                <div
                  className={`mt-4 rounded-xl p-4 border-2 ${capacityInfo.borderColor} ${capacityInfo.backgroundColor}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-semibold ${capacityInfo.textColor}`}>
                      Capacity Status:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${capacityInfo.backgroundColor} ${capacityInfo.textColor} border ${capacityInfo.borderColor}`}
                    >
                      {capacityInfo.percentage}% booked
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p>
                        <span className={`${capacityInfo.textColor} font-semibold`}>
                          Total Capacity:
                        </span>{" "}
                        {bus.capacity}
                      </p>
                      <p>
                        <span className={`${capacityInfo.textColor} font-semibold`}>
                          Seats Left:
                        </span>{" "}
                        {bus.capacity - bus.seatsBooked.length}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${capacityInfo.textColor}`}>
                        {capacityInfo.percentage}%
                      </p>
                      <p className="text-gray-600 text-sm">booked</p>
                    </div>
                  </div>
                </div>

                {/* Booking Section */}
                <div className="mt-6">
                  <p className="text-gray-800 text-lg font-medium">
                    <span className="text-blue-600 font-semibold">Selected Seats:</span>{" "}
                    {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                  </p>
                  <p className="text-gray-800 text-lg font-medium mt-2">
                    <span className="text-blue-600 font-semibold">Total Price:</span> ₹
                    {bus.price * selectedSeats.length}
                  </p>

                  <button
                    className={`mt-4 w-full py-2 px-5 rounded-lg font-semibold transition ${
                      selectedSeats.length === 0
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    onClick={() => bookNow("direct-booking")}
                    disabled={selectedSeats.length === 0}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </Col>

            {/* Right Side - Seat Selection */}
            <Col lg={12} xs={24}>
              <div className="bg-white shadow-md rounded-2xl p-6">
                <SeatSelection
                  selectedSeats={selectedSeats}
                  setSelectedSeats={setSelectedSeats}
                  bus={bus}
                />
              </div>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}

export default BookNow;
