import React, { useEffect, useState, useCallback } from "react";
import BusForm from "../../components/BusForm";
import PageTitle from "../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table } from "antd";
import { Helmet } from "react-helmet";
import { getCapacityColors } from "../../helpers/capacityColors";

function AdminBuses() {
  const dispatch = useDispatch();
  const [showBusForm, setShowBusForm] = useState(false);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  const getBuses = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/get-all-buses", {});
      dispatch(HideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const deleteBus = async (_id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.delete(`/api/buses/${_id}`, {});
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getBuses();
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
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Bus Number",
      dataIndex: "busNumber",
    },
    {
      title: "From",
      dataIndex: "from",
    },
    {
      title: "To",
      dataIndex: "to",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
    },
    {
      title: "Capacity Status",
      dataIndex: "capacity",
      render: (capacity, record) => {
        const capacityInfo = getCapacityColors(capacity, record.seatsBooked);
        return (
          <div
            className={`${capacityInfo.backgroundColor} p-3 rounded-lg border ${capacityInfo.borderColor} shadow-sm`}
          >
            <div className="text-center">
              <div className={`font-bold text-lg ${capacityInfo.textColor}`}>
                {capacityInfo.percentage}%
              </div>
              <div className={`text-xs font-medium ${capacityInfo.textColor}`}>
                {capacityInfo.status}
              </div>
              <div className="text-xs text-gray-600">
                {record.seatsBooked?.length || 0}/{capacity} seats
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        if (status === "Completed") {
          return <span className="text-red-500 font-semibold">{status}</span>;
        } else if (status === "running") {
          return <span className="text-yellow-500 font-semibold">{status}</span>;
        } else {
          return <span className="text-green-500 font-semibold">{status}</span>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (actions, record) => (
        <div className="flex gap-4">
          <i
            className="ri-delete-bin-line cursor-pointer text-red-500 text-xl hover:scale-110 transition-transform"
            onClick={() => deleteBus(record._id)}
          ></i>
          <i
            className="ri-pencil-line cursor-pointer text-blue-600 text-xl hover:scale-110 transition-transform"
            onClick={() => {
              setSelectedBus(record);
              setShowBusForm(true);
            }}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBuses();
  }, [getBuses]);

  return (
    <>
      <Helmet>
        <title>Buses</title>
      </Helmet>
      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <PageTitle title="Buses" />
          <button
            type="button"
            className="px-6 py-2 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
            onClick={() => setShowBusForm(true)}
          >
            + Add Bus
          </button>
        </div>

        {/* Table Section */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <Table
            columns={columns}
            dataSource={buses}
            pagination={{ pageSize: 7 }}
            className="custom-table"
          />
        </div>

        {/* Modal Form */}
        {showBusForm && (
          <BusForm
            showBusForm={showBusForm}
            setShowBusForm={setShowBusForm}
            type={selectedBus ? "edit" : "add"}
            selectedBus={selectedBus}
            setSelectedBus={setSelectedBus}
            getData={getBuses}
          />
        )}
      </div>
    </>
  );
}

export default AdminBuses;
