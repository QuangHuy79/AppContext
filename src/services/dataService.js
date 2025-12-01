export const dataService = {
  async fetchAll() {
    // Giả lập fetch API
    await new Promise((res) => setTimeout(res, 600));
    return {
      profile: { name: "John Doe", email: "john@example.com" },
      settings: { theme: "dark", language: "en" },
    };
  },

  async save(key, value) {
    // Giả lập lưu dữ liệu vào localStorage hoặc server
    localStorage.setItem(`app_data_${key}`, JSON.stringify(value));
    return true;
  },

  async clear() {
    // Xóa toàn bộ cache
    Object.keys(localStorage)
      .filter((k) => k.startsWith("app_data_"))
      .forEach((k) => localStorage.removeItem(k));
  },
};
