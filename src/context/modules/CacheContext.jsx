import React, { createContext, useContext, useCallback, useState } from "react";

export const CacheContext = createContext();

export const CacheProvider = ({ children }) => {
  const [cache, setCacheState] = useState({}); // rename state setter

  // ✅ Set cache data
  const setCacheData = useCallback((key, data, ttl = 60000) => {
    const expires = Date.now() + ttl;
    setCacheState((prev) => ({ ...prev, [key]: { data, expires } }));
  }, []);

  // ✅ Get cache data
  const getCacheData = useCallback(
    (key) => {
      const entry = cache[key];
      if (!entry) return null;
      if (Date.now() > entry.expires) {
        setCacheState((prev) => {
          const newCache = { ...prev };
          delete newCache[key];
          return newCache;
        });
        return null;
      }
      return entry.data;
    },
    [cache]
  );

  const clearCache = useCallback(() => setCacheState({}), []);

  // 🔹 Map lại tên cho IntegrationRunner
  const setCache = setCacheData; // không trùng với state setter
  const getCache = getCacheData;

  return (
    <CacheContext.Provider
      value={{
        cache,
        setCache,
        getCache,
        clearCache,
        setCacheData,
        getCacheData,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = () => useContext(CacheContext);

// Luồng chạy CacheContext

// Khởi tạo Context

// CacheContext được tạo ra với createContext().

// Provider: CacheProvider.

// State nội bộ

// cache (object) lưu trữ dữ liệu tạm thời theo dạng { key: { data, expires } }.

// useState quản lý cache.

// Set cache

// setCacheData(key, data, ttl):

// Tạo một entry { data, expires } với expires = Date.now() + ttl.

// Cập nhật state cache bằng setCacheState.

// Memoized với useCallback → tránh re-render không cần thiết.

// Get cache

// getCacheData(key):

// Lấy entry từ cache.

// Kiểm tra TTL (expires) → nếu quá hạn thì xóa entry và trả null.

// Nếu còn hạn → trả data.

// Memoized với useCallback, phụ thuộc cache.

// Clear cache

// clearCache() → reset toàn bộ cache thành {}.

// Mapping API tiện dụng

// setCache = setCacheData

// getCache = getCacheData
// → để dùng nhất quán với các module khác và IntegrationRunner.

// Provider

// Truyền xuống toàn bộ API:

// { cache, setCache, getCache, clearCache, setCacheData, getCacheData }

// Bao bọc children.

// Custom hook

// useCache() để các component khác truy cập context dễ dàng.

// ✅ Điểm nổi bật

// TTL tự động xóa entry quá hạn.

// Các hàm useCallback giúp tối ưu render.

// API tiện dụng (setCache / getCache) phù hợp cho các module khác gọi.
