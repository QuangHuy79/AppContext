// // src/App.jsx
import { useEffect } from "react";
import AppRuntimeClient from "./core/runtime/AppRuntimeClient";
import { emitEvent } from "./core/obs/eventStream";
export default function App() {
  useEffect(() => {
    emitEvent("app:mount");
  }, []);

  return <AppRuntimeClient />;
}
