import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { message, Table, Modal } from "antd";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import PageTitle from "../components/PageTitle";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import logo from "../assets/img/logo.png";
import { Helmet } from "react-helmet";
import QRCode from "react-qr-code";

function Bookings() {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const getBookings = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(
        `/api/bookings/${localStorage.getItem("user_id")}`
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
            user: booking.user.name,
          };
        });
        setBookings(mappedData);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const CancelBooking = async () => {
    try {
      dispatch(ShowLoading());
      const res = await axiosInstance.get(
        `/api/bookings/${localStorage.getItem("user_id")}`
      );
      const bus_id = res.data.data[0].bus._id;
      const user_id = res.data.data[0].user._id;
      const booking_id = res.data.data[0]._id;
      const response = await axiosInstance.delete(
        `/api/bookings/${booking_id}/${user_id}/${bus_id}`
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getBookings();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Bus",
      dataIndex: "name",
      key: "bus",
    },
    {
      title: "Passenger",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Bus No.",
      dataIndex: "busNumber",
      key: "bus",
    },
    {
      title: "Date",
      dataIndex: "journeyDate",
      render: (journeyDate) => moment(journeyDate).format("DD/MM/YYYY"),
    },
    {
      title: "Departure",
      dataIndex: "departure",
      render: (departure) => moment(departure, "HH:mm").format("hh:mm A"),
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats) => seats.join(", "),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-3">
          <button
            className="px-3 py-1 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition"
            onClick={() => {
              setSelectedBooking(record);
              setShowPrintModal(true);
            }}
          >
            View
          </button>
          <button
            className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
            onClick={() => CancelBooking()}
          >
            Cancel
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Helmet>
        <title>Bookings</title>
      </Helmet>

      <div className="p-6">
        <PageTitle title="My Bookings" />
        <div className="bg-white shadow-md rounded-xl p-4">
          <Table
            columns={columns}
            dataSource={bookings}
            pagination={{ pageSize: 5 }}
          />
        </div>

        {showPrintModal && (
  <Modal
    title="Your Ticket"
    onCancel={() => {
      setShowPrintModal(false);
      setSelectedBooking(null);
    }}
    open={showPrintModal}
    okText="Print Ticket"
    onOk={handlePrint}
    footer={null}
  >
    <div
      className="flex justify-center items-center"
      ref={componentRef}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Ticket Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-800 to-blue-600 text-white">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Raasta Logo" className="h-10" />
            <h2 className="text-lg font-bold">
              {selectedBooking?.name}
            </h2>
          </div>
          <span className="font-semibold">
            Passenger: {selectedBooking?.user}
          </span>
        </div>

        {/* Route Info */}
        <div className="flex justify-between items-center px-6 py-6 border-b border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500">From</p>
            <p className="font-bold text-xl text-gray-800">{selectedBooking?.from}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-1 bg-blue-600 rounded-full mb-1"></div>
            <p className="text-xs text-gray-500">Route</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">To</p>
            <p className="font-bold text-xl text-gray-800">{selectedBooking?.to}</p>
          </div>
        </div>

        {/* Timing Info */}
        <div className="grid grid-cols-3 gap-6 px-6 py-4 border-b border-gray-200 text-sm">
          <div>
            <p className="text-gray-500">Departure</p>
            <p className="font-semibold text-gray-800">
              {moment(selectedBooking?.departure, "HH:mm").format("hh:mm A")}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Arrival</p>
            <p className="font-semibold text-gray-800">
              {moment(selectedBooking?.arrival, "HH:mm").format("hh:mm A")}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-semibold text-gray-800">
              {moment(selectedBooking?.journeyDate).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        {/* Price & Seats */}
        <div className="flex justify-between items-center px-6 py-6">
          <div>
            <p className="text-gray-500 text-sm">Seat No.</p>
            <p className="font-bold text-lg text-gray-800">
              {selectedBooking?.seats.join(", ")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-sm">Total Price</p>
            <p className="font-bold text-xl text-blue-700">
              ₹{selectedBooking?.price * selectedBooking?.seats.length}
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Print Ticket
          </button>
        </div>
      </div>
    </div>
  </Modal>
)}

      </div>
    </>
  );
}

export default Bookings;
