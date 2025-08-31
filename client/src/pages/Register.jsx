import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../redux/alertsSlice";
import { Helmet } from "react-helmet";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [passwordShown, setPasswordShown] = useState(false);

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Password and Confirm Password must be same");
      return;
    }

    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/auth/create-user", values);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/login");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const TogglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <Form onFinish={onFinish} className="h-screen flex">
        {/* Left Side Banner */}
        <div
          className="hidden lg:flex w-full lg:w-2/3"
          style={{
            backgroundSize: "cover",
            backgroundImage: `url("https://wallpapercave.com/wp/wp6913872.jpg")`,
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex items-center h-full w-full px-20 bg-black bg-opacity-40"></div>
        </div>

        {/* Right Side Form */}
        <div className="bg-white flex w-full lg:w-1/3 justify-center items-center shadow-xl">
          <div className="w-full px-8 md:px-12">
            <div className="flex items-center mb-6">
              <Link
                to="/"
                className="flex items-center text-blue-600 hover:text-blue-800 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                Back
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Create Account
            </h1>

            {/* Full Name */}
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please input your fullname!" }]}
            >
              <div className="mb-4">
                <label className="block text-gray-600 text-sm mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
            </Form.Item>

            {/* Email */}
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <div className="mb-4">
                <label className="block text-gray-600 text-sm mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border bg-white rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <div className="mb-4 relative">
                <label className="block text-gray-600 text-sm mb-1">
                  Password
                </label>
                <input
                  type={passwordShown ? "text" : "password"}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                />
                <span
                  className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                  onClick={TogglePassword}
                >
                  {passwordShown ? "🙈" : "👁️"}
                </span>
              </div>
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              name="confirmPassword"
              rules={[{ required: true, message: "Please confirm your password!" }]}
            >
              <div className="mb-6 relative">
                <label className="block text-gray-600 text-sm mb-1">
                  Confirm Password
                </label>
                <input
                  type={passwordShown ? "text" : "password"}
                  className="w-full px-3 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm password"
                />
                <span
                  className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                  onClick={TogglePassword}
                >
                  {passwordShown ? "🙈" : "👁️"}
                </span>
              </div>
            </Form.Item>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Register
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </Form>
    </>
  );
}

export default Register;
