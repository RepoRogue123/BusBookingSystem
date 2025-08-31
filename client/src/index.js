import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import { Provider } from "react-redux";
import { NotificationProvider } from "./contexts/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </Provider>
);

reportWebVitals();
