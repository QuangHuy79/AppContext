// Toast chỉ chạy thông qua UIContext
// src/context/modules/DataContext.jsx
import React, { createContext, useEffect, useMemo, useContext } from "react";
import { dataService } from "../../services/dataService";
import { useAuth } from "../AuthContext/useAuth";
import { useAppContext, useAppDispatch } from "../AppContext";

// Context cho Data
const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user } = useAuth(); // user từ AuthContext
  const { state } = useAppContext(); // root AppState
  const dispatch = useAppDispatch(); // dispatch root AppState

  // --- Load toàn bộ data (có thể gọi lại từ UI: Reload Data) ---
  const loadData = async () => {
    if (!user) {
      // Nếu user null → reset data
      dispatch({ type: "DATA/RESET" });

      // Dispatch toast qua UIContext
      dispatch({
        type: "UI/SHOW_TOAST",
        payload: { type: "info", message: "Data reset" },
      });
      return;
    }

    dispatch({ type: "DATA/LOADING", payload: true });

    try {
      const result = await dataService.fetchAll();
      dispatch({ type: "DATA/SET_ALL", payload: result });

      // Thông báo thành công qua UIContext
      dispatch({
        type: "UI/SHOW_TOAST",
        payload: { type: "success", message: "Data loaded successfully" },
      });
    } catch (error) {
      // Thông báo lỗi qua UIContext
      dispatch({
        type: "UI/SHOW_TOAST",
        payload: { type: "error", message: "Failed to load data" },
      });
    } finally {
      dispatch({ type: "DATA/LOADING", payload: false });
    }
  };

  // --- Auto load khi user thay đổi ---
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // --- Cập nhật 1 key-value ---
  const updateData = async (key, value) => {
    try {
      dispatch({ type: "DATA/UPDATE", payload: { key, value } });
      await dataService.save(key, value);

      // Toast thông báo qua UIContext
      dispatch({
        type: "UI/SHOW_TOAST",
        payload: { type: "info", message: `Updated "${key}" successfully` },
      });
    } catch (error) {
      dispatch({
        type: "UI/SHOW_TOAST",
        payload: { type: "error", message: "Update failed" },
      });
    }
  };

  // --- Reset toàn bộ data ---
  const resetData = async () => {
    dispatch({ type: "DATA/RESET" });
    await dataService.clear();

    dispatch({
      type: "UI/SHOW_TOAST",
      payload: { type: "info", message: "All data cleared" },
    });
  };

  // --- Gộp value để cung cấp ra ngoài ---
  const value = useMemo(
    () => ({
      data: state.data,
      updateData,
      resetData,
      loadData, // expose loadData để UI gọi
    }),
    [state.data]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Hook tiện lợi để lấy context
export const useData = () => useContext(DataContext);

// 📌 LUỒNG CHẠY TÓM TẮT – ĐỂ LƯU VÀO DỰ ÁN
// (Bạn có thể copy phần này vào tài liệu AppRuntime v1)

// User login/logout
// → AuthContext thay đổi user
// → DataContext useEffect gọi loadData()

// loadData()

// Nếu user null → reset data + toast “Data reset”

// Nếu user có
// → loading true
// → fetchAll()
// → set all data
// → toast success/error
// → loading false

// updateData(key, value)
// → cập nhật state ngay
// → save lên API
// → toast “Updated ••• successfully”

// resetData()
// → DATA/RESET
// → dataService.clear()
// → toast “All data cleared”

// UIContext chịu trách nhiệm render toast
