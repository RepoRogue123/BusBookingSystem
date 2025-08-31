import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import { useNotifications } from "../contexts/NotificationContext";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpSearch, setHelpSearch] = useState("");
  const { user } = useSelector((state) => state.users);
  const { 
    notifications, 
    unreadCount, 
    loading: notificationsLoading,
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    loadMore,
  pagination,
  refresh
  } = useNotifications();

  const mainUserMenu = [
    { name: "Home", path: "/raasta", icon: "ri-home-4-line" },
    { name: "Bookings", path: "/bookings", icon: "ri-file-list-3-line" },
  ];

  const mainAdminMenu = [
    { name: "Home", path: "/raasta", icon: "ri-home-4-line" },
    { name: "Buses", path: "/admin/buses", icon: "ri-bus-wifi-line" },
    { name: "Users", path: "/admin/users", icon: "ri-group-line" },
    { name: "Bookings", path: "/admin/bookings", icon: "ri-file-list-3-line" },
  ];

  const logoutMenu = {
    name: "Logout",
    path: "/logout",
    icon: "ri-logout-box-r-line",
  };



  // Help/FAQ content
  const helpContent = [
    {
      question: "How do I book a bus ticket?",
      answer: "Navigate to the Book Now section, select your route, date, and preferred seats. Complete the payment to confirm your booking."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking from the My Bookings section. Cancellation policies may apply based on the time before departure."
    },
    {
      question: "How do I check my booking status?",
      answer: "Go to My Bookings to view all your current and past bookings with their status."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit/debit cards, UPI, and net banking for secure payments."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our support team at support@raasta.com or call us at 1800-RASTA-1."
    }
  ];

  const menutoBeRendered = user?.isAdmin ? mainAdminMenu : mainUserMenu;
  let activeRoute = window.location.pathname;
  if (window.location.pathname.includes("book-now")) {
    activeRoute = "/raasta";
  }



  // Close modals when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications || showHelp) {
        const modals = document.querySelectorAll('.modal-overlay');
        let clickedOutside = true;
        modals.forEach(modal => {
          if (modal.contains(event.target)) {
            clickedOutside = false;
          }
        });
        if (clickedOutside) {
          setShowNotifications(false);
          setShowHelp(false);
        }
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setShowHelp(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showNotifications, showHelp]);

  // Mark notification as read using context
  const markNotificationAsRead = (notificationId) => {
    markAsRead(notificationId);
  };



  // Handle support actions
  const handleEmailSupport = () => {
    window.open('mailto:support@raasta.com?subject=Support Request', '_blank');
  };

  const handleCallSupport = () => {
    window.open('tel:1800-RASTA-1', '_blank');
  };

  // Filter help content based on search
  const filteredHelpContent = helpContent.filter(item =>
    item.question.toLowerCase().includes(helpSearch.toLowerCase()) ||
    item.answer.toLowerCase().includes(helpSearch.toLowerCase())
  );

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
              <div className="relative">
                <i 
                  className="ri-notification-3-line text-2xl text-slate-600 cursor-pointer hover:text-sky-600"
                  onClick={() => {
                    const next = !showNotifications;
                    setShowNotifications(next);
                    if (next) {
                      // Refresh notifications when opening the panel so it's up to date
                      refresh();
                    }
                  }}
                ></i>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <i 
                className="ri-question-line text-2xl text-slate-600 cursor-pointer hover:text-sky-600"
                onClick={() => setShowHelp(!showHelp)}
              ></i>
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

      {/* Notification Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center modal-overlay">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-sky-600 to-sky-500 text-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-white hover:text-slate-200 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {notificationsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notifications yet</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 rounded-xl border-l-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        notification.read
                          ? 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                          : 'bg-blue-50 border-blue-500 hover:bg-blue-100'
                      }`}
                      onClick={() => markNotificationAsRead(notification._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`font-medium ${
                            notification.read ? 'text-gray-700' : 'text-blue-900'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.type === 'booking' 
                                ? 'bg-green-100 text-green-800'
                                : notification.type === 'system'
                                ? 'bg-blue-100 text-blue-800'
                                : notification.type === 'promo'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {notification.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {!notification.read && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          <i className="ri-delete-bin-line mr-1"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Load More Button */}
                  {pagination.hasMore && (
                    <div className="text-center pt-4">
                      <button
                        onClick={loadMore}
                        className="bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-4 border-t">
              <button
                onClick={markAllAsRead}
                className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors"
                disabled={unreadCount === 0}
              >
                Mark All as Read
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center modal-overlay">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Help & FAQ</h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-white hover:text-slate-200 transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {/* Search Input */}
              <div className="mb-6">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search help topics..."
                    value={helpSearch}
                    onChange={(e) => setHelpSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                {filteredHelpContent.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="ri-search-line text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">No help topics found for "{helpSearch}"</p>
                    <p className="text-gray-400 text-sm mt-2">Try searching with different keywords</p>
                  </div>
                ) : (
                  filteredHelpContent.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-semibold text-gray-800 mb-2">{item.question}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="bg-gray-50 p-4 border-t">
              <div className="text-center">
                <p className="text-gray-600 mb-2">Need more help?</p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={handleEmailSupport}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <i className="ri-mail-line mr-2"></i>
                    Email Support
                  </button>
                  <button 
                    onClick={handleCallSupport}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <i className="ri-phone-line mr-2"></i>
                    Call Support
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      setShowHelp(false);
                      navigate('/notification-settings');
                    }}
                    className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                  >
                    <i className="ri-settings-3-line mr-1"></i>
                    Notification Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DefaultLayout;
