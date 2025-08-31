import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import moment from "moment";
import { getCapacityColors } from "../helpers/capacityColors";

function Bus({ bus }) {
  const navigate = useNavigate();
  const capacityInfo = getCapacityColors(bus.capacity, bus.seatsBooked);

  return (
    <div
      className={`w-full bg-white flex flex-col rounded-xl overflow-hidden shadow-md border ${capacityInfo.borderColor} transition hover:shadow-lg`}
    >
      {/* Header with Logo & Journey Date */}
      <div className="flex items-center bg-gray-100 px-4 py-3">
        <img
          className="h-14 w-14 object-contain mr-3"
          src={logo}
          alt="Raasta Logo"
        />
        <div>
          <h2 className="text-sm uppercase font-semibold text-gray-700">
            Journey Date
          </h2>
          <p className="text-gray-500">{bus.journeyDate}</p>
        </div>
      </div>

      {/* Capacity Status */}
      <div
        className={`${capacityInfo.backgroundColor} px-4 py-2 border-b ${capacityInfo.borderColor}`}
      >
        <div className="flex items-center justify-between">
          <span className={`font-medium ${capacityInfo.textColor}`}>
            Capacity: {capacityInfo.percentage}% Full
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${capacityInfo.backgroundColor} ${capacityInfo.textColor} border ${capacityInfo.borderColor}`}
          >
            {capacityInfo.status}
          </span>
        </div>
      </div>

      {/* Bus Details */}
      <div className="flex flex-wrap sm:flex-nowrap justify-between px-6 py-4">
        <div className="mb-3 sm:mb-0">
          <p className="text-base font-bold">{bus.name}</p>
          <p className="text-sm text-gray-500">{bus.busNumber}</p>
        </div>

        <div className="mb-3 sm:mb-0">
          <p className="font-semibold">Departure</p>
          <p>{moment(bus.departure, "HH:mm").format("hh:mm A")}</p>
          <p className="font-semibold mt-1">From</p>
          <p className="text-gray-500">{bus.from}</p>
        </div>

        <div>
          <p className="font-semibold">Arrival</p>
          <p>{moment(bus.arrival, "HH:mm").format("hh:mm A")}</p>
          <p className="font-semibold mt-1">To</p>
          <p className="text-gray-500">{bus.to}</p>
        </div>
      </div>

      {/* Price & Book Button */}
      <div className="bg-gray-50 flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t">
        {/* Price */}
        <div className="flex items-center mb-4 sm:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-600 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold">Price</p>
            <p className="text-base">₹{bus.price}</p>
          </div>
        </div>

        {/* Book Button */}
        <button
          className="relative inline-flex items-center justify-center px-8 py-3 font-semibold rounded-full overflow-hidden group"
          onClick={() => {
            if (localStorage.getItem("user_id")) {
              navigate(`/book-now/${bus._id}`);
            } else {
              navigate(`/login`);
            }
            localStorage.removeItem("idTrip");
            localStorage.setItem("idTrip", bus._id);
          }}
        >
          <span className="absolute inset-0 w-full h-full bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition duration-500 ease-in-out"></span>
          <span className="relative text-blue-600 group-hover:text-white">
            Book Now
          </span>
          <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
        </button>
      </div>
    </div>
  );
}

export default Bus;
