import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.users);

  const mainUserMenu = [
    { name: "Home", path: "/easy-booking", icon: "ri-home-4-line" },
    { name: "Bookings", path: "/bookings", icon: "ri-file-list-3-line" },
  ];

  const mainAdminMenu = [
    { name: "Home", path: "/easy-booking", icon: "ri-home-4-line" },
    { name: "Buses", path: "/admin/buses", icon: "ri-bus-wifi-line" },
    { name: "Users", path: "/admin/users", icon: "ri-group-line" },
    { name: "Bookings", path: "/admin/bookings", icon: "ri-file-list-3-line" },
  ];

  const logoutMenu = {
    name: "Logout",
    path: "/logout",
    icon: "ri-logout-box-r-line",
  };

  const menutoBeRendered = user?.isAdmin ? mainAdminMenu : mainUserMenu;
  let activeRoute = window.location.pathname;
  if (window.location.pathname.includes("book-now")) {
    activeRoute = "/easy-booking";
  }

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 font-poppins">
      {/* Sidebar */}
      <div
        className={`sticky top-0 h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl transition-all duration-300 ease-in-out ${
          collapsed ? "w-24" : "w-80"
        }`}
      >
        {/* Logo and User Info */}
        <div className="flex flex-col items-center p-6 border-b border-slate-700/60">
          <img
            onClick={() => navigate("/")}
            src={logo}
            alt="Raasta Logo"
            className={`cursor-pointer transition-all duration-500 ${
              collapsed ? "w-14" : "w-28"
            }`}
          />
          {!collapsed && (
            <div className="mt-6 text-center">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.name}&background=random&color=fff`}
                alt="User Avatar"
                className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-sky-400 shadow-md"
              />
              <p className="font-semibold text-slate-200">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-grow flex flex-col justify-between p-4">
          <div className="flex flex-col gap-2">
            {menutoBeRendered.map((item, key) => {
              const isActive = activeRoute === item.path;
              return (
                <div
                  key={key}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                    isActive
                      ? "bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-lg"
                      : "hover:bg-slate-800/70 text-slate-300"
                  } ${collapsed ? "justify-center" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <i className={`${item.icon} text-xl`} />
                  {!collapsed && (
                    <span className="font-medium tracking-wide">
                      {item.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Logout */}
          <div
            className={`flex items-center gap-4 rounded-xl px-4 py-3 cursor-pointer transition-all duration-300 bg-gradient-to-r from-red-700 to-red-600 hover:opacity-90 text-white shadow-md ${
              collapsed ? "justify-center" : ""
            }`}
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            <i className={`${logoutMenu.icon} text-xl`} />
            {!collapsed && (
              <span className="font-medium tracking-wide">
                {logoutMenu.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm flex items-center justify-between p-4 shadow-md sticky top-0 z-10 border-b border-slate-200">
          {/* Collapse/Expand + Title */}
          <div className="flex items-center gap-4">
            {collapsed ? (
              <i
                className="ri-menu-unfold-fill cursor-pointer text-2xl text-slate-600 hover:text-sky-600"
                onClick={() => setCollapsed(false)}
              />
            ) : (
              <i
                className="ri-menu-fold-fill cursor-pointer text-2xl text-slate-600 hover:text-sky-600"
                onClick={() => setCollapsed(true)}
              />
            )}
            <h1 className="text-xl font-bold text-slate-800 hidden md:block tracking-tight">
              Dashboard
            </h1>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-5">
              <i className="ri-notification-3-line text-2xl text-slate-600 cursor-pointer hover:text-sky-600"></i>
              <i className="ri-question-line text-2xl text-slate-600 cursor-pointer hover:text-sky-600"></i>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6 md:p-10 flex-grow bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="bg-white rounded-2xl shadow-xl p-6 min-h-[80vh]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DefaultLayout;
