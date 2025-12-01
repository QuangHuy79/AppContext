import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
} from "react";

export const DeviceContext = createContext(null); // ✅ PHẢI export

export const DeviceProvider = ({ children }) => {
  const getDeviceInfo = () => {
    const width = window.innerWidth;
    return {
      width,
      height: window.innerHeight,
      isMobile: width < 640,
      isTablet: width >= 640 && width < 1024,
      isDesktop: width >= 1024,
    };
  };

  const [device, setDevice] = useState(getDeviceInfo());

  useEffect(() => {
    const handleResize = () => setDevice(getDeviceInfo());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const value = useMemo(() => device, [device]);

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevice must be used within DeviceProvider");
  }
  return context;
};

// Luồng chạy thực tế (tóm tắt)
// Khi App khởi chạy → getDeviceInfo() chạy để lấy kích thước hiện tại.
// device state khởi tạo từ đó.
// Khi user resize hoặc xoay màn hình, handleResize() được gọi → cập nhật state → re-render Provider.
// Các component dùng useDevice() sẽ tự nhận giá trị mới (width, isMobile, v.v.).
