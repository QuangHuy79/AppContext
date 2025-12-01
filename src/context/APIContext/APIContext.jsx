// import React, { createContext, useContext, useCallback, useState } from "react";
// import toastService from "../../services/toastService";

// export const APIContext = createContext();

// export const APIProvider = ({ children }) => {
//   const [loading, setLoading] = useState(false);

//   // 💡 Cấu hình baseURL cố định cho json-server
//   const BASE_URL = "http://localhost:3001";

//   const request = useCallback(
//     async (endpoint, options = {}) => {
//       setLoading(true);
//       try {
//         const url = endpoint.startsWith("http")
//           ? endpoint
//           : `${BASE_URL}${endpoint}`; // auto nối baseURL nếu endpoint là "/posts"

//         const res = await fetch(url, options);
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await res.json();

//         console.log("[DEBUG][APIContext] ✅ Fetch OK:", url, data);
//         toastService.show("success", "Fetch thành công", `API: ${endpoint}`);

//         return data;
//       } catch (error) {
//         console.error("[DEBUG][APIContext] ❌ Error:", error);
//         toastService.show("error", error.message, "API Error");
//         throw error;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [BASE_URL]
//   );

//   const get = useCallback(
//     (endpoint) => request(endpoint, { method: "GET" }),
//     [request]
//   );

//   const post = useCallback(
//     (endpoint, body) =>
//       request(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       }),
//     [request]
//   );

//   return (
//     // <APIContext.Provider value={{ loading, get, post }}>
//     <APIContext.Provider
//       value={{
//         loading,
//         get,
//         post,
//         api: { get, post }, // ✅ thêm dòng này để tương thích AuthContext
//       }}
//     >
//       {children}
//     </APIContext.Provider>
//   );
// };

// export const useAPI = () => useContext(APIContext);

// =============================
// APIContext v2 (giữ nguyên comment + thêm các phần tối ưu)
import React, { createContext, useContext, useCallback, useState } from "react";
import toastService from "../../services/toastService";

// 💡 BASE_URL để ra ngoài component để không tạo lại mỗi lần render
const BASE_URL = "http://localhost:3001";

export const APIContext = createContext();

export const APIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // -------------------------------------------------------------------
  // 💡 request(): hàm fetch đa dụng, hỗ trợ GET, POST, PUT, DELETE
  //    Bản này giữ nguyên comment gốc của bạn và thêm comment mới
  // -------------------------------------------------------------------
  const request = useCallback(
    async (endpoint, options = {}, showToast = true) => {
      setLoading(true);

      try {
        const url = endpoint.startsWith("http")
          ? endpoint
          : `${BASE_URL}${endpoint}`;

        const mergedOptions = {
          // auto thêm Content-Type nếu chưa có
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          },
          ...options,
        };

        const res = await fetch(url, mergedOptions);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // ✔️ Safe parse JSON — tránh crash khi API không trả JSON
        let data = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }

        console.log("[DEBUG][APIContext] ✅ Fetch OK:", url, data);

        if (showToast) {
          toastService.show("success", "Fetch thành công", `API: ${endpoint}`);
        }

        return data;
      } catch (error) {
        console.error("[DEBUG][APIContext] ❌ Error:", error);

        if (showToast) {
          toastService.show("error", error.message, "API Error");
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [] // ⬅️ không để BASE_URL trong dependency nữa
  );

  // --------------------------------------------------------
  // 💡 GET
  // --------------------------------------------------------
  const get = useCallback(
    (endpoint, showToast = true) => {
      return request(endpoint, { method: "GET" }, showToast);
    },
    [request]
  );

  // --------------------------------------------------------
  // 💡 POST
  // --------------------------------------------------------
  const post = useCallback(
    (endpoint, body, showToast = true) =>
      request(
        endpoint,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
        showToast
      ),
    [request]
  );

  // --------------------------------------------------------
  // 💡 PUT — thiếu trong code gốc
  // --------------------------------------------------------
  const put = useCallback(
    (endpoint, body, showToast = true) =>
      request(
        endpoint,
        {
          method: "PUT",
          body: JSON.stringify(body),
        },
        showToast
      ),
    [request]
  );

  // --------------------------------------------------------
  // 💡 DELETE — thiếu trong code gốc
  // --------------------------------------------------------
  const del = useCallback(
    (endpoint, showToast = true) =>
      request(endpoint, { method: "DELETE" }, showToast),
    [request]
  );

  return (
    <APIContext.Provider
      value={{
        loading,
        get,
        post,
        put,
        del,

        // ⚡ giữ nguyên dòng bạn thêm để tương thích AuthContext
        api: { get, post, put, del },
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

export const useAPI = () => useContext(APIContext);

// 2️⃣ – LUỒNG CHẠY (FLOW) HOÀN CHỈNH
// Khi UI hoặc AuthContext gọi:
// await api.get("/user")
// Luồng chạy:

// (1) get()
// → gọi request(endpoint, { method: "GET" })

// (2) request()
// bật loading = true

// tự ghép baseURL

// fetch()

// nếu lỗi → throw

// nếu ok → parse JSON

// bắn toast qua toastService

// tắt loading

// (3) trả dữ liệu về Auth / Data / UI
// Mọi hành động đều đúng thứ tự — không lỗi.
