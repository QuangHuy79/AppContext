// src/hooks/useNotification.js
import { useContext } from "react";
import { NotificationContext } from "../context/modules/NotificationContext";

export const useNotification = () => useContext(NotificationContext);
