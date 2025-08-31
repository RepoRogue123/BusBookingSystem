import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Bus from "../components/Bus";
import { message } from "antd";
import { Helmet } from "react-helmet";

function Home() {
  const dispatch = useDispatch();
  const [buses, setBuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [filters, setFilters] = useState({});

  const getBusesByFilter = useCallback(async () => {
    dispatch(ShowLoading());
    const { from, to, journeyDate } = filters;
    try {
      const { data } = await axiosInstance.post(
        `/api/buses/get?from=${from}&to=${to}&journeyDate=${journeyDate}`
      );
      setBuses(data.data);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.response?.data?.message || "Something went wrong");
    }
  }, [filters, dispatch]);

  useEffect(() => {
    axiosInstance.get("/api/cities/get-all-cities").then((response) => {
      setCities(response.data.data);
    });
  }, []);

  useEffect(() => {
    if (filters.from && filters.to && filters.journeyDate) {
      getBusesByFilter();
    }
  }, [filters.from, filters.to, filters.journeyDate, getBusesByFilter]);

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        {/* Filter Section */}
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
            Search Your Journey
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From */}
            <select
              className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            >
              <option value="">From</option>
              {cities.map((city, idx) => (
                <option key={idx} value={city.ville}>
                  {city.ville}
                </option>
              ))}
            </select>

            {/* To */}
            <select
              className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            >
              <option value="">To</option>
              {cities.map((city, idx) => (
                <option key={idx} value={city.ville}>
                  {city.ville}
                </option>
              ))}
            </select>

            {/* Date */}
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFilters({ ...filters, journeyDate: e.target.value })
              }
            />

            {/* Search Button */}
            <button
              onClick={getBusesByFilter}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300"
            >
              Search
            </button>
          </div>
        </div>

        {/* Bus Results */}
        <div className="max-w-5xl mx-auto">
          {buses.length > 0 ? (
            <div className="space-y-4">
              {buses.map((bus, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-md p-4">
                  <Bus bus={bus} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center py-20">
              <h1 className="text-2xl font-bold text-gray-400">
                No buses found
              </h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
