// // src/test/TestNotification.jsx
// import React from "react";
// import { useNotification } from "../hooks/useNotification";

// export default function TestNotification() {
//   const {
//     notifications,
//     addNotification,
//     removeNotification,
//     markAsRead,
//     clearAll,
//   } = useNotification();

//   return (
//     <div style={{ padding: 20 }}>
//       <h3>Notification Test</h3>

//       <button
//         onClick={() =>
//           addNotification("info", "Đây là một thông báo mới", "Thông báo")
//         }
//       >
//         + Add Notification
//       </button>

//       <button onClick={clearAll} style={{ marginLeft: 10 }}>
//         Clear All
//       </button>

//       <ul style={{ marginTop: 20 }}>
//         {notifications.map((n) => (
//           <li key={n.id}>
//             <strong>[{n.type}]</strong> {n.title} - {n.message}{" "}
//             {n.read ? "✅" : "🕑"}{" "}
//             <button onClick={() => markAsRead(n.id)}>Đánh dấu đọc</button>
//             <button onClick={() => removeNotification(n.id)}>Xóa</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// ===================
import React from "react";
import { useNotification } from "../context/modules/NotificationContext";

export default function TestNotification() {
  const { notifications, addNotification, markAsRead, clearAll } =
    useNotification();

  return (
    <div style={{ padding: 20 }}>
      <h3>🔔 NotificationContext - Test</h3>

      <div style={{ marginBottom: 10 }}>
        <button
          onClick={() =>
            addNotification("info", "Thông tin", "Đây là thông báo thông tin")
          }
        >
          + Info
        </button>
        <button
          onClick={() =>
            addNotification(
              "success",
              "Thành công",
              "Dữ liệu đã lưu thành công!"
            )
          }
          style={{ marginLeft: 10 }}
        >
          + Success
        </button>
        <button
          onClick={() =>
            addNotification(
              "warning",
              "Cảnh báo",
              "Bạn sắp hết dung lượng lưu trữ!"
            )
          }
          style={{ marginLeft: 10 }}
        >
          + Warning
        </button>
        <button
          onClick={() =>
            addNotification("error", "Lỗi", "Không thể kết nối tới máy chủ!")
          }
          style={{ marginLeft: 10 }}
        >
          + Error
        </button>
        <button onClick={clearAll} style={{ marginLeft: 10, color: "red" }}>
          Xóa tất cả
        </button>
      </div>

      {notifications.length === 0 ? (
        <p>Không có thông báo nào.</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            style={{
              margin: "8px 0",
              padding: "10px 12px",
              borderRadius: 6,
              borderLeft: `6px solid ${getTypeColor(n.type)}`,
              backgroundColor: "#f9f9f9",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <strong style={{ color: getTypeColor(n.type) }}>
              [{n.type.toUpperCase()}] {n.title}
            </strong>
            <p style={{ margin: "4px 0" }}>{n.message}</p>
            <small>{n.time}</small>
            {!n.read && (
              <button
                onClick={() => markAsRead(n.id)}
                style={{
                  marginLeft: 10,
                  background: "#eee",
                  border: "none",
                  padding: "2px 8px",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Đã đọc
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function getTypeColor(type) {
  switch (type) {
    case "success":
      return "green";
    case "warning":
      return "orange";
    case "error":
      return "red";
    default:
      return "blue";
  }
}
