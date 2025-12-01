import React, { useState } from "react";
import { useCache } from "../context/modules/CacheContext";
import { useAPI } from "../context/APIContext/APIContext";

const TestCache = () => {
  const { getCacheData, setCacheData, clearCache } = useCache();
  const { get } = useAPI();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleClear = () => {
    clearCache();
    setData(null); // 🔹 reset dữ liệu UI
    console.log("🧹 Cache đã xóa sạch!");
  };
  const handleFetch = async () => {
    const cacheKey = "/posts";
    const cached = getCacheData(cacheKey);

    if (cached) {
      console.log("✅ Lấy từ cache");
      setData(cached);
      return;
    }

    console.log("🌐 Gọi API thật");
    setLoading(true);
    try {
      const result = await get("http://localhost:3001/posts");
      setCacheData(cacheKey, result, 10000); // cache 10s
      setData(result);
    } catch (err) {
      console.error("Lỗi fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🧠 TestCache</h2>
      <button onClick={handleFetch} disabled={loading}>
        {loading ? "Đang tải..." : "Tải dữ liệu"}
      </button>

      <button onClick={handleClear} style={{ marginLeft: 10 }}>
        Xóa Cache
      </button>

      {data && (
        <ul style={{ marginTop: 20 }}>
          {data.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong> — {item.body}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestCache;
