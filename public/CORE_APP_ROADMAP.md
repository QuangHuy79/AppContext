CORE APP ROADMAP
Mount-Ready Architecture Strategy
🎯 MỤC TIÊU TỔNG THỂ
Xây dựng lại Application Structure theo hướng:
Sau khi hoàn thành roadmap này, các component đã build sẵn (Cart, ProductDetail, PaymentForm, SidebarComponentHeader, ShoppingCarts, …) có thể được mount trực tiếp vào App mà không cần refactor lại toàn bộ structure.
Structure phải:
Có chỗ gắn (mounting slots)
Có feature separation rõ ràng
Không để component render trực tiếp từ root
Không phải đập đi xây lại lần nữa

PHASE 1 — Establish AppRoot
Mục tiêu
Tạo một entry point chuẩn cho toàn bộ ứng dụng.
Kết quả đạt được
Có AppRoot duy nhất
Có Router
Có Global Providers (nếu cần)
Không còn logic lẫn lộn ở index/main

PHASE 2 — Build AppShell
Mục tiêu
Tạo layout khung cố định cho toàn App.
Cấu trúc cần có
Header (slot)
Sidebar (slot)
Main Content (dynamic slot)
Kết quả đạt được
App có một “bộ khung” ổn định để mount feature vào.
BƯỚC TIẾP THEO: Thiết kế Layout Contract (Phase 2 đúng chuẩn)
Chúng ta cần trả lời 4 câu hỏi kiến trúc cốt lõi.
1️⃣ Layout được định nghĩa ở đâu?
Không nên để layout rải rác.
👉 Layout phải được khai báo tập trung tại AppRoot level.
Ví dụ concept:
<AppRoot layout={layoutConfig}>
...
</AppRoot>
AppShell chỉ đọc layoutConfig.
Không tự quyết định layout.
2️⃣ Layout Config phải chứa gì?
Tối thiểu:
{
regions: string[],
defaultRegion: string
}
Rule:
regions không được rỗng
defaultRegion phải nằm trong regions
Đây là “khuôn khổ”.
3️⃣ Mount Rule
Core áp đặt luật:
Router render vào defaultRegion
Feature chỉ được mount vào region tồn tại
Không region → không mount
Không mount trực tiếp từ AppRoot
4️⃣ AppShell có trách nhiệm gì?
AppShell:
Validate layoutConfig
Tạo region registry
Cung cấp mount context cho feature
AppShell không:
Quyết định UI cụ thể
Chứa business logic
Chứa feature
🧱 Sau bước này, kiến trúc sẽ rõ:
AppRoot
↓
AppShell (reads layoutConfig)
↓
Region Engine
↓
Router / Feature
🔥 Vì sao đây là bước quan trọng nhất?
Vì:
Nếu layout contract mơ hồ → Phase 4 sẽ rối
Nếu region không có rule → feature mount lung tung
Nếu không có defaultRegion → Router không có chỗ đứng
Bạn đang xây framework, không phải app demo.
📌 Đây là "tự do theo khuôn khổ"
Tự do:
Project define region tuỳ ý
Khuôn khổ:
Phải có defaultRegion
Phải mount qua region
Không render trực tiếp
🗺 MINI ROADMAP CHO PHASE 2
Chia thành 4 bước nhỏ, tuần tự, không chồng chéo.

🟢 STEP 2.1 — Tạo AppShell Boundary
Mục tiêu
Tách AppRoot khỏi Router / Feature.
Kết quả đạt được
AppRoot
↓
AppShell
↓
Router
Không làm
Không slot
Không region
Không mount logic
👉 Chỉ tạo architectural boundary.
🟡 STEP 2.2 — Định nghĩa Layout Contract
Mục tiêu
Tạo interface chính thức cho layout.
Kết quả đạt được
LayoutConfig tồn tại
Có defaultRegion
Có regions array
Có validation rule cơ bản
Không làm
Không mount feature
Không overlay logic
Không render phức tạp
👉 Đây là bước kiến trúc quan trọng nhất của Phase 2.
🟠 STEP 2.3 — Tạo Region Registry Concept
Mục tiêu
AppShell hiểu được:
Region nào tồn tại
Region nào là default
Kết quả đạt được
Có internal registry
Có LayoutContext
Router biết render vào defaultRegion
Không làm
Không multi-mount
Không overlay stacking
Không feature refactor
🔵 STEP 2.4 — Verify Structural Stability
Mục tiêu
Đảm bảo:
App vẫn chạy
Router hoạt động
Không component render trực tiếp từ AppRoot
Layout có thể thay đổi config mà không crash
👉 Đây là bước bắt buộc theo Stability Rule (Phase 6 của roadmap lớn).
🚦 Khi Phase 2 hoàn thành
Bạn sẽ có:
✔ AppShell dynamic
✔ LayoutConfig contract
✔ Region governance
✔ Router mount đúng nơi
✔ Không UI cứng
Nhưng bạn sẽ CHƯA có:
❌ Slot engine hoàn chỉnh
❌ Feature mount system đầy đủ
❌ Overlay orchestration
Những cái đó là Phase 4.
🧠 Quan trọng
Phase 2 chỉ làm:
“Chuẩn bị đất”
Không “xây nhà”.

PHASE 3 — Create Feature Layer
Mục tiêu
Tách App thành các feature độc lập.
Ví dụ cấu trúc
features/
cart/
products/
checkout/
layout/
Kết quả đạt được
Mỗi feature có folder riêng
Component không còn nằm rải rác
Chuẩn bị cho việc mount đúng vị trí

PHASE 4 — Define Mounting Slots
Mục tiêu
Xác định rõ ràng nơi các feature sẽ render trong AppShell.
Ví dụ
Sidebar mount ở đâu?
ProductDetail render qua route nào?
Cart nằm trong page hay overlay?
Kết quả đạt được
Không còn tình trạng “không có chỗ gắn component”.

PHASE 5 — Refactor Existing Components
Mục tiêu
Đưa các component đã build vào đúng Feature Layer.
Áp dụng cho:
Cart
ShoppingCarts
ProductDetail
PaymentForm
SidebarComponentHeader
…
Kết quả đạt được
Component được mount đúng slot, không phá structure.

PHASE 6 — Stability Rule
Nguyên tắc bắt buộc
Sau mỗi phase:
App phải chạy được
Không được để project broken
Không refactor toàn bộ một lần
🔒 NGUYÊN TẮC TRIỂN KHAI
Không code ồ ạt.
Hoàn thành từng phase.
Mỗi phase xong phải verify chạy ổn.
Không thêm feature mới trước khi structure ổn định.
✅ END STATE (Khi Roadmap hoàn thành)
App có kiến trúc rõ ràng
Component có chỗ mount chính thức
Có thể mở rộng thêm feature mà không đập lại cấu trúc
Sẵn sàng tiến tới Production structure
