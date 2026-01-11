# SECURITY RULES — PHASE 4 (LOCKED)

This document defines NON-NEGOTIABLE security rules.
Breaking any rule below is a SECURITY BUG.

---

## 🔐 Token & Auth

ALLOW:

- Token exists ONLY in tokenService
- AuthContext is the ONLY consumer of tokenService

DENY:

- Token in AppState
- Token in UIContext
- Components reading token directly
- Duplicated refresh logic

---

## 💾 Persistence

ALLOW:

- Persist domain: settings

DENY:

- ui
- network
- features
- data
- dataLoading
- auth (removed domain)

Any persistence outside whitelist is a SECURITY VIOLATION.

---

## 🌐 Network

DENY:

- Trusting response shape
- Trusting status code alone

REQUIRED:

- Normalize API response
- Normalize API error
- Offline must not crash UI

---

## 🖥️ UI / XSS

DENY:

- dangerouslySetInnerHTML
- Raw HTML rendering
- DOM injection with user input

ALLOW:

- React text node rendering only

---

## 🧪 Changes Impacting Security

Any change touching:

- tokenService
- AuthContext
- StatePersistence
- apiService
- rendering user/backend strings

MUST re-check PHASE 4.

## 🔐 Security Checklist (Phase 4)

- [ ] Feature này có lưu state không?
- [ ] State đó có nằm ngoài `settings` không?
- [ ] Có bypass tokenService không?
- [ ] Có render string từ user / backend không?
- [ ] Có chạm tới persistence / hydration không?

If ANY answer is YES → re-check PHASE 4 before merge.
