import React, { useCallback, useState, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table } from "antd";
import { Helmet } from "react-helmet";

function AdminUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get("/api/users/get-all-users", {});
      dispatch(HideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Account Created At",
      dataIndex: "createdAt",
      render: (_, record) => new Date(record.createdAt).toLocaleDateString(),
    },
  ];

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <>
      <Helmet>
        <title>Users</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <PageTitle title="Users" />
        </div>

        {/* Card Container */}
        <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Registered Users
          </h2>
          <div className="overflow-x-auto">
            <Table
              className="custom-table"
              columns={columns}
              dataSource={users}
              pagination={{ pageSize: 5 }}
              rowKey="_id"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminUsers;
