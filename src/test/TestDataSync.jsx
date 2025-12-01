import React from "react";
import { useContext } from "react";
// import { DataSyncContext } from "../contexts/DataSyncContext";
import { DataSyncContext } from "../context/modules/DataSyncContext";

export default function TestDataSync() {
  const { lastSync, syncing, syncNow } = useContext(DataSyncContext);

  return (
    <div style={{ padding: 20 }}>
      <h3>Data Sync Test</h3>
      <p>
        Trạng thái: {syncing ? "🔄 Đang đồng bộ..." : "✅ Đã sẵn sàng đồng bộ"}
      </p>
      <p>
        Lần đồng bộ gần nhất:{" "}
        {lastSync ? lastSync.toLocaleTimeString() : "Chưa có"}
      </p>
      <button onClick={syncNow} disabled={syncing}>
        {syncing ? "Đang đồng bộ..." : "Đồng bộ ngay"}
      </button>
    </div>
  );
}
