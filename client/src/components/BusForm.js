import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Row, Form, Col, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function BusForm({
  showBusForm,
  setShowBusForm,
  type = "add",
  getData,
  selectedBus,
  setSelectedBus,
}) {
  const dispatch = useDispatch();
  const [cities, setCities] = useState([]);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (type === "add") {
        response = await axiosInstance.post("/api/buses/add-bus", values);
      } else {
        response = await axiosInstance.put(
          `/api/buses/${selectedBus._id}`,
          values
        );
      }
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      getData();
      setShowBusForm(false);
      setSelectedBus(null);
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    axiosInstance.get("/api/cities/get-all-cities").then((response) => {
      setCities(response.data.data);
    });
  }, []);

  return (
    <Modal
      width={800}
      title={
        <span className="text-xl font-semibold text-gray-800">
          {type === "add" ? "➕ Add Bus" : "✏️ Update Bus"}
        </span>
      }
      open={showBusForm}
      onCancel={() => {
        setSelectedBus(null);
        setShowBusForm(false);
      }}
      footer={false}
      className="rounded-xl"
    >
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={selectedBus}
        className="mt-4"
      >
        <Row gutter={[16, 16]}>
          {/* Bus Name */}
          <Col lg={24} xs={24}>
            <Form.Item
              label={<span className="font-medium text-gray-700">Bus Name</span>}
              name="name"
              rules={[{ required: true, message: "Please enter bus name" }]}
            >
              <input
  type="text"
  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
/>

            </Form.Item>
          </Col>

          {/* Bus Number & Capacity */}
          <Col lg={12} xs={24}>
            <Form.Item
              label={
                <span className="font-medium text-gray-700">Bus Number</span>
              }
              name="busNumber"
              rules={[{ required: true, message: "Please input bus number!" }]}
            >
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label={
                <span className="font-medium text-gray-700">Capacity</span>
              }
              name="capacity"
              rules={[{ required: true, message: "Please input bus capacity!" }]}
            >
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </Form.Item>
          </Col>

          {/* From & To */}
          <Col lg={12} xs={24}>
            <Form.Item
              label={<span className="font-medium text-gray-700">From</span>}
              name="from"
              rules={[{ required: true, message: "Please choose a city" }]}
            >
              <select className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select City</option>
                {cities.map((data, index) => (
                  <option key={index} value={data.ville}>
                    {data.ville}
                  </option>
                ))}
              </select>
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label={<span className="font-medium text-gray-700">To</span>}
              name="to"
              rules={[{ required: true, message: "Please choose a city" }]}
            >
              <select className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select City</option>
                {cities.map((data, index) => (
                  <option key={index} value={data.ville}>
                    {data.ville}
                  </option>
                ))}
              </select>
            </Form.Item>
          </Col>

          {/* Journey Date, Departure & Arrival */}
          <Col lg={8} xs={24}>
            <Form.Item
              label={
                <span className="font-medium text-gray-700">Journey Date</span>
              }
              name="journeyDate"
              rules={[{ required: true, message: "Please input journey date!" }]}
            >
              <input
                min={new Date().toISOString().split("T")[0]}
                type="date"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item
              label={
                <span className="font-medium text-gray-700">Departure</span>
              }
              name="departure"
              rules={[{ required: true, message: "Please input departure time!" }]}
            >
              <input
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item
              label={<span className="font-medium text-gray-700">Arrival</span>}
              name="arrival"
              rules={[{ required: true, message: "Please input arrival time!" }]}
            >
              <input
                type="time"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </Form.Item>
          </Col>

          {/* Price & Status */}
          <Col lg={12} xs={24}>
            <Form.Item
              label={<span className="font-medium text-gray-700">Price (₹)</span>}
              name="price"
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label={<span className="font-medium text-gray-700">Status</span>}
              name="status"
              rules={[{ required: true }]}
            >
              <select className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Yet to start">Yet To Start</option>
                <option value="Running">Running</option>
                <option disabled value="Completed">
                  Completed
                </option>
              </select>
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="px-8 py-3 font-semibold rounded-lg bg-blue-600 text-white shadow-md hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default BusForm;
