import React from "react";
import { getCapacityColors } from "../helpers/capacityColors";

function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
  const capacity = bus.capacity;
  const capacityInfo = getCapacityColors(bus.capacity, bus.seatsBooked);

  const selectOrUnselectSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  return (
    <div className="m-5 flex flex-col items-center">
      {/* Capacity Status Header */}
      <div
        className={`${capacityInfo.backgroundColor} w-full max-w-lg p-4 rounded-lg border ${capacityInfo.borderColor} mb-6 shadow`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2
              className={`font-bold text-lg ${capacityInfo.textColor}`}
            >
              Seat Availability: {capacityInfo.status}
            </h2>
            <p className={`text-sm ${capacityInfo.textColor}`}>
              {bus.seatsBooked.length} of {capacity} seats booked (
              {capacityInfo.percentage}% full)
            </p>
          </div>
          <div className={`text-right ${capacityInfo.textColor}`}>
            <p className="text-2xl font-bold">{capacityInfo.percentage}%</p>
            <p className="text-xs">Capacity</p>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="w-full max-w-lg p-4 border border-blue-400 rounded-lg shadow">
        <h3 className="text-center text-lg font-semibold mb-4 text-gray-700">
          Select Your Seats
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {Array.from(Array(capacity).keys()).map((seat) => {
            let seatClass =
              "w-12 h-12 flex items-center justify-center rounded-md font-semibold border cursor-pointer transition";

            if (selectedSeats.includes(seat + 1)) {
              seatClass += " bg-blue-500 text-white border-blue-600";
            } else if (bus.seatsBooked.includes(seat + 1)) {
              seatClass +=
                " bg-red-500 text-white border-red-600 cursor-not-allowed opacity-70";
            } else {
              seatClass +=
                " bg-gray-100 hover:bg-blue-100 text-gray-700 border-gray-300";
            }

            return (
              <div
                key={seat}
                className={seatClass}
                onClick={() => {
                  if (!bus.seatsBooked.includes(seat + 1)) {
                    selectOrUnselectSeat(seat + 1);
                  }
                }}
              >
                {seat + 1}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center mt-6 gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 border border-gray-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-500 border border-blue-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 border border-red-600 rounded"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;
