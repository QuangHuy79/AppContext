import React from "react";
import { useAuth } from "../hooks/useAuth";

export default function TestAuth() {
  const { user, token, isAuthenticated, login, logout, loading } = useAuth();

  const handleLogin = async () => {
    try {
      const data = await login({
        email: "test@example.com",
        password: "123456",
      });
      console.log("Login success:", data);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Auth Test</h3>
      <p>Authenticated: {isAuthenticated ? "✅ Yes" : "❌ No"}</p>
      <p>User: {user ? JSON.stringify(user) : "None"}</p>
      <p>Token: {token || "No token"}</p>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
