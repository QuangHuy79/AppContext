import React from "react";
import { AppProvider } from "../context/AppContext";
import { useDataContext } from "../context/modules/DataContext";

function DataTestContent() {
  const { data, loading, loadData, updateData, resetData } = useDataContext();

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>🧩 Test DataContext Integration</h2>

      <div style={{ marginBottom: 10 }}>
        {loading ? (
          <p>⏳ Loading data...</p>
        ) : (
          <pre
            style={{
              background: "#f4f4f4",
              padding: 10,
              borderRadius: 8,
              fontSize: 13,
              maxWidth: 400,
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={loadData}>🔄 Reload Data</button>
        <button
          onClick={() =>
            updateData("profile", {
              name: "Jane Doe",
              email: "jane@example.com",
            })
          }
        >
          ✏️ Update Profile
        </button>
        <button onClick={resetData}>🧹 Reset Data</button>
      </div>
    </div>
  );
}

export default function TestData() {
  return (
    <AppProvider>
      <DataTestContent />
    </AppProvider>
  );
}
