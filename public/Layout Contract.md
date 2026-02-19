🎯 MỤC TIÊU
Tạo một Layout Contract để:
Project định nghĩa cấu trúc UI
Core quản lý mount
Feature chỉ mount vào region hợp lệ
Không hardcode layout

🧱 1️⃣ LayoutConfig – Interface Chính Thức
Đây là contract đề xuất:
type LayoutConfig = {
id: string
regions: RegionDefinition[]
defaultRegion: string
}
RegionDefinition
type RegionDefinition = {
name: string
type?: "static" | "dynamic" | "overlay"
multiple?: boolean
}
🧠 Giải thích từng phần
🔹 id
Giúp:
Nhận diện layout
Cho phép swap layout sau này
Debug rõ ràng
🔹 regions
Ví dụ project A:
regions: [
{ name: "navbar", type: "static" },
{ name: "content", type: "dynamic" },
{ name: "footer", type: "static" }
]
Project B:
regions: [
{ name: "workspace", type: "dynamic" },
{ name: "drawer", type: "overlay", multiple: true }
]
Core không quan tâm tên gì.
Chỉ validate.
🔹 defaultRegion
Router mount vào đây
Nếu không có → layout invalid
Rule cứng:
defaultRegion ∈ regions
🧭 2️⃣ Region Type — Tại sao cần?
static
Render cố định (vd navbar)
dynamic
Router / page content
overlay
Modal / drawer / popup
Core không render UI.
Nhưng hiểu semantics để quản lý mount behavior.
🧱 3️⃣ Mount Rules (Khuôn khổ)
Đây là phần quan trọng nhất.
Rule 1
Feature chỉ được mount vào region tồn tại.
Rule 2
Router chỉ mount vào region type = dynamic.
Rule 3
Overlay region có thể allow multiple mount nếu multiple = true.
Rule 4
Không có region = không render.
🧠 4️⃣ Trách nhiệm từng layer
AppRoot
Cung cấp layoutConfig
AppShell
Validate layout
Tạo RegionRegistry
Cung cấp context mount
Feature
Declare targetRegion
Không render trực tiếp
🏗 Kiến trúc sau Phase 2
AppRoot
└── layoutConfig
↓
AppShell
├── validateLayout()
├── createRegionRegistry()
└── provide LayoutContext
↓
Router / Feature
🔥 Điều này giải quyết được gì?
✔ Không hardcode layout
✔ Không phụ thuộc UI
✔ Không cần refactor khi đổi project
✔ Chuẩn bị sẵn cho Phase 4 (Define Mounting Slots)
✔ Tự do nhưng có luật
📌 Quan trọng
Phase 2 dừng ở:
Có LayoutConfig
Có validation
Có Region Registry concept
Chưa cần:
Slot engine phức tạp
Dynamic re-layout
Runtime layout switching
