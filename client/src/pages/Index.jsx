import logo from "../assets/img/logo.png";
import { Helmet } from "react-helmet";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import Bus from "../components/Bus";
import { message } from "antd";
import { Link } from "react-router-dom";

function Index() {
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
        <title>Easy-Booking</title>
      </Helmet>

      <div className="h-screen flex flex-col lg:flex-row bg-gray-900">
        {/* Left Side: Background / Buses */}
        <div
          className="hidden lg:flex flex-1 bg-cover bg-center relative"
          style={{
            backgroundImage: `url("https://cdn.dribbble.com/userupload/22737651/file/original-d3a8bd3e75ed6df3a9ec20136d2e9253.gif")`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative w-full overflow-y-auto py-6 px-8">
            {buses.length > 0 && (
              <div className="space-y-4">
                {buses.map((bus, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-4"
                  >
                    <Bus bus={bus} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
          <div className="max-w-md w-full text-center">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img
                src={logo}
                alt="logo"
                className="w-20 h-20 rounded-full shadow-md"
              />
            </div>

            {/* Title + Tagline */}
            <h1 className="mb-4 text-4xl lg:text-5xl font-bold text-white">
              Easy-Booking
            </h1>
            <p className="mb-6 text-lg text-gray-300">
              Book your bus tickets online, fast and hassle-free.
            </p>

            {/* CTA Button */}
            <Link
              to="/login"
              className="inline-block px-8 py-3 mb-8 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300"
            >
              Check your tickets
            </Link>

            {/* Search Filters */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Search Your Journey
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* From */}
                <select
                  className="w-full p-3 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setFilters({ ...filters, from: e.target.value })
                  }
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
                  className="w-full p-3 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setFilters({ ...filters, to: e.target.value })
                  }
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
                  className="w-full p-3 rounded-lg bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) =>
                    setFilters({ ...filters, journeyDate: e.target.value })
                  }
                />

                {/* Search Button */}
                <button
                  onClick={getBusesByFilter}
                  className="w-full sm:col-span-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300"
                >
                  Search
                </button>
              </div>

              {/* Placeholder */}
              {buses.length === 0 && (
                <p className="mt-6 text-gray-300">Make your search now</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
