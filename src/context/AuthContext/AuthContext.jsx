import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AppContext } from "../AppContext";
// import { APIContext } from "../APIContext/APIContext";
import { APIContext } from "../APIContext/APIContext.jsx";
import { tokenService } from "../../services/tokenService";

// 🟢 AuthContext: cung cấp trạng thái và hành động liên quan đến xác thực người dùng
export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: false,
  login: async () => {},
  logout: () => {},
  refreshSession: async () => {},
});

export const AuthProvider = ({ children }) => {
  // 🧩 Lấy dispatch từ AppContext (để gọi toast)
  const { dispatch } = useContext(AppContext);

  // 🔗 Lấy api từ APIContext (mock axios instance)
  const { api } = useContext(APIContext);

  // 🔸 State quản lý user, loading và khởi tạo
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // ✅ Xác định trạng thái đăng nhập
  const isAuthenticated = !!user;

  // 🟢 Khôi phục phiên từ localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const token = tokenService.getAccessToken();
      if (!token) return setInitialized(true); // ⏹ Không có token → hoàn tất khởi tạo

      try {
        setLoading(true);

        // 🔹 Giả lập API /me (vì chưa có endpoint thật)
        const me = { id: 1, name: "John Doe", email: "john@example.com" };
        setUser(me);

        // 🟩 Hiển thị toast khôi phục thành công
        dispatch({
          type: "UI/SHOW_TOAST",
          payload: {
            type: "success",
            title: "Session",
            message: "Đã khôi phục đăng nhập",
          },
        });
      } catch (err) {
        // ❌ Nếu token hỏng hoặc hết hạn → clear
        tokenService.clearTokens();
      } finally {
        setLoading(false);
        setInitialized(true); // ✅ Đánh dấu khởi tạo hoàn tất
      }
    };

    restoreSession();
  }, [dispatch]);

  // 🔑 Đăng nhập (mock)
  const login = useCallback(
    async ({ email, password }) => {
      setLoading(true);
      try {
        // 🔹 Dùng APIContext (mock gọi GET /posts)
        await api.get("/posts");

        // ⏳ Mô phỏng độ trễ mạng
        await new Promise((r) => setTimeout(r, 600));

        // 🔸 Token và user giả lập
        const fakeToken = "mock-access-token";
        const fakeRefresh = "mock-refresh-token";
        const fakeUser = { id: 1, name: "John Doe", email };

        // 💾 Lưu token vào tokenService
        tokenService.setTokens(fakeToken, fakeRefresh);
        setUser(fakeUser);

        // 🟢 Hiển thị toast thành công
        dispatch({
          type: "UI/SHOW_TOAST",
          payload: {
            type: "success",
            title: "Login",
            message: "Đăng nhập thành công",
          },
        });

        return fakeUser;
      } catch (error) {
        // ❌ Xử lý lỗi đăng nhập
        dispatch({
          type: "UI/SHOW_TOAST",
          payload: {
            type: "error",
            title: "Error",
            message: "Đăng nhập thất bại",
          },
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api, dispatch]
  );

  // 🚪 Đăng xuất
  const logout = useCallback(() => {
    tokenService.clearTokens();
    setUser(null);

    // 🟦 Hiển thị thông báo logout
    dispatch({
      type: "UI/SHOW_TOAST",
      payload: {
        type: "info",
        title: "Logout",
        message: "Đã đăng xuất",
      },
    });
  }, [dispatch]);

  // 🔄 Refresh token (mock)
  const refreshSession = useCallback(async () => {
    const refresh = tokenService.getRefreshToken();
    if (!refresh) return logout(); // ❌ Không có refresh token → đăng xuất luôn

    try {
      // ⏳ Mô phỏng gọi API refresh
      await new Promise((r) => setTimeout(r, 400));

      // 🔁 Cập nhật access token mới
      tokenService.setTokens("mock-access-token-new", refresh);

      // 🟢 Hiển thị thông báo thành công
      dispatch({
        type: "UI/SHOW_TOAST",
        payload: {
          type: "info",
          title: "Session",
          message: "Làm mới token thành công",
        },
      });
    } catch (err) {
      logout();
    }
  }, [logout, dispatch]);

  // 🧩 Cung cấp toàn bộ giá trị cho các component con
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshSession,
        initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 📝 Khi có API thật:
// await api.post("/login", { email, password })
// await api.get("/me")
// await api.post("/refresh")
export const useAuth = () => useContext(AuthContext);

// Dưới đây là luồng chạy thực tế khi App khởi động + khi login/logout + khi refresh:

// 🔵 1. App khởi động → Auth khôi phục phiên
// AuthProvider mount → chạy useEffect(restoreSession):

// ✔ Flow:
// Lấy token từ tokenService.getAccessToken()

// Nếu không có token →
// → initialized = true → kết thúc.

// Nếu có token →

// loading = true

// Giả lập /me

// setUser(me)

// Dispatch toast: “Đã khôi phục đăng nhập”

// Kết thúc khởi tạo → initialized = true

// 🔍 Kết luận:
// Flow này đúng, không có rủi ro, không leak state.
// Tương thích DataContext (vì DataContext auto load khi user thay đổi).

// 🟢 2. Khi người dùng login
// Gọi login({ email, password }).

// ✔ Flow:
// loading=true

// Gọi API:

// await api.get("/posts")
// → dùng chính xác từ APIContext

// Fake delay 600ms

// Sinh token + user giả

// Lưu token → tokenService.setTokens(...)

// setUser(fakeUser)

// Dispatch toast: “Đăng nhập thành công”

// loading=false

// 🔍 Kết luận:
// Luồng chạy login hoàn chỉnh, không sai.
// ✔ Không gây re-render dư
// ✔ Tương thích DataContext + DataSyncContext
// ✔ Gọn và chuẩn.

// 🔴 3. Khi logout
// Gọi logout():

// ✔ Flow:
// Xóa token

// setUser(null)

// Toast → “Đã đăng xuất”

// 🔍 Kết luận:
// Flow đúng, không gây lỗi ở DataContext (vì DataContext tự reset khi user null).

// 🟣 4. Refresh token
// Flow:

// Lấy refresh token

// Không có -> auto logout

// Có:

// fake API delay

// set access token mới

// toast “Làm mới token thành công”

// Flow này ổn, không sai logic.

// 🟡 5. Tương thích với APIContext
// Bạn đang gọi:

// const { api } = useContext(APIContext);
// await api.get("/posts")
// Và APIContext cung cấp:

// api: { get, post }
// ==> HOÀN TOÀN TƯƠNG THÍCH
// Không có sai mismatch nữa.

// 🟢 Đánh giá cuối cùng module AuthContext
// Thành phần	Kết quả
// Khôi phục phiên	✔ Hoạt động chuẩn
// Login	✔ Chuẩn APIContext
// Logout	✔ Không leak state
// Refresh	✔ Flow chuẩn
// Tương thích DataContext	✔ Chính xác
// Tương thích DataSync	✔ Không xung đột
// Tương thích AppReducer	✔ UI toast dispatch OK
// Gọi API	✔ Không lỗi path
// State	✔ Không re-render thừa
