// src/wrappers/NotificationWrapper.jsx
import React from "react";
import { NotificationProvider } from "../context/modules/NotificationContext.js";

const NotificationWrapper = ({ children }) => {
  return <NotificationProvider>{children}</NotificationProvider>;
};

export default NotificationWrapper;
