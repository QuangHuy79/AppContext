// import React, { useEffect, useState } from "react";
// import { useAPI } from "../context/modules/APIContext";
// import toastService from "../services/toastService";
// const TestAPI = () => {
//   const api = useAPI();
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     if (!api?.get) return; // tránh lỗi undefined
//     api.get("https://jsonplaceholder.typicode.com/posts/1").then((d) => {
//       if (d) setData(d);
//     });
//   }, [api]);

//   if (!api) return <p>⛔ API Context chưa sẵn sàng</p>;
//   if (api.loading) return <p>Loading...</p>;
//   if (!data) return <p>Đang chờ dữ liệu...</p>;

//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-2">✅ Test API Context</h2>
//       <pre className="bg-gray-100 p-2 rounded">
//         {JSON.stringify(data, null, 2)}
//       </pre>
//       <button
//         onClick={() => toastService.show("success", "Toast hoạt động!", "OK")}
//       >
//         Gọi ToastService
//       </button>
//     </div>
//   );
// };

// export default TestAPI;

// bản chuẩn cuối cùng của bước 13
import React, { useState } from "react";
// import { useAPI } from "../context/modules/APIContext";
import { useAPI } from "../context/APIContext/APIContext";

const TestAPI = () => {
  const { get, post, loading } = useAPI();
  const [data, setData] = useState(null);

  const handleFetch = async () => {
    try {
      const result = await get("https://jsonplaceholder.typicode.com/posts/1");
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePost = async () => {
    try {
      const result = await post("https://jsonplaceholder.typicode.com/posts", {
        title: "Hello API",
        body: "Testing POST request",
        userId: 1,
      });
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Test APIContext</h2>
      <button
        onClick={handleFetch}
        disabled={loading}
        className="px-3 py-1 bg-blue-600 text-white rounded-md mr-2"
      >
        {loading ? "Loading..." : "GET Data"}
      </button>
      <button
        onClick={handlePost}
        disabled={loading}
        className="px-3 py-1 bg-green-600 text-white rounded-md"
      >
        {loading ? "Loading..." : "POST Data"}
      </button>
      {data && (
        <pre className="bg-gray-100 mt-3 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default TestAPI;
