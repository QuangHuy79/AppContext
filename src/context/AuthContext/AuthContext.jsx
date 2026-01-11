// // FILE FULL — src/context/AuthContext/AuthContext.jsx (CLEAN)
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
// } from "react";

// import { useAppDispatch } from "../AppContext";
// import { useAPI } from "../APIContext/APIContext";
// import { tokenService } from "../../services/tokenService";
// import { emitEvent } from "../../obs/eventStream"; // OBS-05

// export const AuthContext = createContext({
//   user: null,
//   isAuthenticated: false,
//   loading: false,
//   initialized: false,
//   login: async () => {},
//   logout: () => {},
//   refreshSession: async () => {},
// });

// export const AuthProvider = ({ children }) => {
//   const dispatch = useAppDispatch();

//   let apiSafe = null;
//   try {
//     apiSafe = useAPI()?.api ?? null;
//   } catch {
//     apiSafe = null;
//   }

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [initialized, setInitialized] = useState(false);

//   const isAuthenticated = Boolean(user);

//   /* --------------------------------------------------
//      Restore session on mount
//   -------------------------------------------------- */
//   useEffect(() => {
//     let mounted = true;

//     const restoreSession = async () => {
//       const token = tokenService.getAccessToken();
//       if (!token) {
//         if (mounted) setInitialized(true);
//         return;
//       }

//       if (!apiSafe || typeof apiSafe.get !== "function") {
//         tokenService.clearTokens();
//         if (mounted) setInitialized(true);
//         return;
//       }

//       try {
//         setLoading(true);

//         const restoredUser = await apiSafe.get("/me");
//         if (mounted) {
//           setUser(restoredUser ?? null);
//         }

//         emitEvent("auth:session:restore", {
//           hasToken: true,
//           userId: restoredUser?.id ?? null,
//         });

//         dispatch({
//           type: "UI/SHOW_TOAST",
//           payload: {
//             type: "success",
//             title: "Session",
//             message: "Đã khôi phục đăng nhập",
//           },
//         });
//       } catch {
//         tokenService.clearTokens();
//       } finally {
//         if (mounted) {
//           setLoading(false);
//           setInitialized(true);
//         }
//       }
//     };

//     restoreSession();

//     return () => {
//       mounted = false;
//     };
//   }, [apiSafe, dispatch]);

//   /* --------------------------------------------------
//      Login (API REQUIRED)
//   -------------------------------------------------- */
//   const login = useCallback(
//     async ({ email, password }) => {
//       if (!apiSafe || typeof apiSafe.post !== "function") {
//         dispatch({
//           type: "UI/SHOW_TOAST",
//           payload: {
//             type: "error",
//             title: "Login",
//             message: "API chưa sẵn sàng",
//           },
//         });
//         return null;
//       }

//       setLoading(true);
//       try {
//         const res = await apiSafe.post("/login", { email, password });

//         if (!res?.accessToken || !res?.refreshToken || !res?.user) {
//           throw new Error("Invalid login response");
//         }

//         tokenService.setTokens(res.accessToken, res.refreshToken);
//         setUser(res.user);

//         emitEvent("auth:login", { userId: res.user.id });

//         dispatch({
//           type: "UI/SHOW_TOAST",
//           payload: {
//             type: "success",
//             title: "Login",
//             message: "Đăng nhập thành công",
//           },
//         });

//         return res.user;
//       } catch (err) {
//         dispatch({
//           type: "UI/SHOW_TOAST",
//           payload: {
//             type: "error",
//             title: "Error",
//             message: "Đăng nhập thất bại",
//           },
//         });
//         throw err;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [apiSafe, dispatch]
//   );

//   /* --------------------------------------------------
//      Logout
//   -------------------------------------------------- */
//   const logout = useCallback(() => {
//     tokenService.clearTokens();
//     setUser(null);

//     emitEvent("auth:logout");

//     dispatch({
//       type: "UI/SHOW_TOAST",
//       payload: {
//         type: "info",
//         title: "Logout",
//         message: "Đã đăng xuất",
//       },
//     });
//   }, [dispatch]);

//   const refreshSession = useCallback(async () => true, []);

//   const value = useMemo(
//     () => ({
//       user,
//       isAuthenticated,
//       loading,
//       initialized,
//       login,
//       logout,
//       refreshSession,
//     }),
//     [user, isAuthenticated, loading, initialized, login, logout, refreshSession]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return ctx;
// };

// =========================================
// AuthContext.jsx (ĐÃ FIX, CHUẨN PHASE 4.1)
// 👉 File này đã loại bỏ hoàn toàn việc đọc token, chỉ giữ đúng trách nhiệm của AuthContext.
// FILE FULL — src/context/AuthContext/AuthContext.jsx (PHASE 4.1 FIXED)

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import { useAppDispatch } from "../AppContext";
import { useAPI } from "../APIContext/APIContext";
import { tokenService } from "../../services/tokenService";
import { emitEvent } from "../../obs/eventStream"; // OBS-05

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  login: async () => {},
  logout: () => {},
  refreshSession: async () => {},
});

export const AuthProvider = ({ children }) => {
  const dispatch = useAppDispatch();

  let apiSafe = null;
  try {
    apiSafe = useAPI()?.api ?? null;
  } catch {
    apiSafe = null;
  }

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const isAuthenticated = Boolean(user);

  /* --------------------------------------------------
     Restore session on mount
     ❗ Phase 4.1: KHÔNG đọc token, chỉ trust API
  -------------------------------------------------- */
  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      if (!apiSafe || typeof apiSafe.get !== "function") {
        if (mounted) setInitialized(true);
        return;
      }

      try {
        setLoading(true);

        const restoredUser = await apiSafe.get("/me");

        if (mounted) {
          setUser(restoredUser ?? null);
        }

        emitEvent("auth:session:restore", {
          success: true,
          userId: restoredUser?.id ?? null,
        });
      } catch {
        // ❗ Token lifecycle do tokenService kiểm soát
        hardLogout();
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, [apiSafe]);

  /* --------------------------------------------------
     Login (API REQUIRED)
     ❗ Phase 4.1: chỉ bootstrap token
  -------------------------------------------------- */
  const login = useCallback(
    async ({ email, password }) => {
      if (!apiSafe || typeof apiSafe.post !== "function") {
        dispatch({
          type: "UI/SHOW_TOAST",
          payload: {
            type: "error",
            title: "Login",
            message: "API chưa sẵn sàng",
          },
        });
        return null;
      }

      setLoading(true);
      try {
        const res = await apiSafe.post("/login", { email, password });

        if (!res?.accessToken || !res?.refreshToken || !res?.user) {
          throw new Error("Invalid login response");
        }

        // 🔐 ENTRY DUY NHẤT ĐƯỢC PHÉP SET TOKEN
        tokenService.bootstrapFromAuth({
          access: res.accessToken,
          refresh: res.refreshToken,
        });

        setUser(res.user);

        emitEvent("auth:login", { userId: res.user.id });

        dispatch({
          type: "UI/SHOW_TOAST",
          payload: {
            type: "success",
            title: "Login",
            message: "Đăng nhập thành công",
          },
        });

        return res.user;
      } catch (err) {
        dispatch({
          type: "UI/SHOW_TOAST",
          payload: {
            type: "error",
            title: "Error",
            message: "Đăng nhập thất bại",
          },
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiSafe, dispatch]
  );

  /* --------------------------------------------------
     Hard Logout
     ❗ Phase 4.1: clear toàn bộ token + auth state
  -------------------------------------------------- */
  const hardLogout = useCallback(() => {
    tokenService.clearAll();

    setUser(null);

    emitEvent("auth:logout");

    dispatch({
      type: "UI/SHOW_TOAST",
      payload: {
        type: "info",
        title: "Logout",
        message: "Đã đăng xuất",
      },
    });
  }, [dispatch]);

  const refreshSession = useCallback(async () => true, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      initialized,
      login,
      logout: hardLogout,
      refreshSession,
    }),
    [
      user,
      isAuthenticated,
      loading,
      initialized,
      login,
      hardLogout,
      refreshSession,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
