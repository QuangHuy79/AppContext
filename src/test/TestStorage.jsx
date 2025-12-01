import React from "react";
import { useStorage } from "../hooks/useStorage";

export default function TestStorage() {
  const { setItem, getItem, removeItem, clear } = useStorage();

  const handleSave = () => {
    setItem("user", { name: "John", age: 30 });
  };

  const handleLoad = () => {
    const data = getItem("user");
    console.log("Loaded:", data);
    alert("Loaded data: " + JSON.stringify(data));
  };

  const handleRemove = () => {
    removeItem("user");
  };

  const handleClear = () => {
    clear();
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Storage Test</h3>
      <button onClick={handleSave}>💾 Save Data</button>
      <button onClick={handleLoad}>📂 Load Data</button>
      <button onClick={handleRemove}>🗑 Remove Item</button>
      <button onClick={handleClear}>🔥 Clear All</button>
    </div>
  );
}
