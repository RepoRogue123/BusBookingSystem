import React, { useState } from "react";
import { Form, message } from "antd";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../redux/alertsSlice";
import { Helmet } from "react-helmet";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordShown, setPasswordShown] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/auth/login", values);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        localStorage.setItem("token", response.data.data);
        localStorage.setItem("user_id", response.data.user._id);

        const idTrip = localStorage.getItem("idTrip");

        if (response.data.user.isAdmin) {
          navigate("/admin/buses");
        } else if (!idTrip) {
          navigate("/bookings");
        } else {
          navigate(`/book-now/${idTrip}`);
        }
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <div className="h-screen flex">
        {/* Left side (image) */}
        <div
          className="hidden lg:flex flex-1 bg-cover bg-center"
          style={{
            backgroundImage: `url("https://img5.goodfon.com/wallpaper/nbig/6/6a/temsa-maraton-coach-bus.jpg")`,
          }}
        >
          <div className="w-full h-full bg-black bg-opacity-40"></div>
        </div>

        {/* Right side (form) */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100 px-6 lg:px-12">
          <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
            {/* Back button */}
            <div className="mb-6">
              <Link
                to="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
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

            {/* Heading */}
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Login
            </h1>

            <Form layout="vertical" onFinish={onFinish}>
              {/* Email */}
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Please input your email!" }]}
              >
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </Form.Item>

              {/* Password */}
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <div className="relative">
                  <input
                    type={passwordShown ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordShown(!passwordShown)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {passwordShown ? (
                      // Eye off
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21"
                        />
                      </svg>
                    ) : (
                      // Eye on
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </Form.Item>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 mt-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>
            </Form>

            {/* Register redirect */}
            <p className="mt-6 text-center text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
