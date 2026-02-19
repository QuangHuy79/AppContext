# STEP 1.1 — Domain Host Skeleton

**Scope locked:** BƯỚC 1 / STEP 1.1 only. No domain code. No lifecycle. No registration. No tests.

## Goal
Create a *legal place* (nơi chốn hợp pháp) for domains **bound to the existing SRC**, without touching Core logic or Runtime behavior.

## Constraints (Non‑Negotiable)
- Domain does **not** import Core
- UI does **not** import Domain
- Communication later must go through contracts
- This step only **places the socket**, not the plug

---

## 📁 Folder placement (minimal, non-invasive)
Added **one new top-level folder** under `src/`:

```
src/
├── domainHost/
│   ├── domainHost.contract.js
│   └── index.js
```

> Rationale: `src/domainHost` is adjacent to `runtime`, `context`, `services` — visible but isolated.

---

## 📄 Artifact 1 — domainHost.contract.js
**Purpose:** Declare the *shape* of a Domain Host without implementation.

```js
// src/domainHost/domainHost.contract.js

/**
 * DomainHost is a structural contract.
 * No logic. No side effects.
 * Domains will conform to this contract later.
 */

export const DomainHostContract = Object.freeze({
  name: 'DomainHost',

  /**
   * Called by runtime when a domain is attached.
   * @param {object} domainDescriptor
   */
  attach(domainDescriptor) {},

  /**
   * Called by runtime when a domain is detached.
   * @param {string} domainId
   */
  detach(domainId) {},
});
```

---

## 📄 Artifact 2 — index.js
**Purpose:** Stable import surface. No behavior.

```js
// src/domainHost/index.js

export { DomainHostContract } from './domainHost.contract';
```

---

## 🔒 What this step explicitly does NOT do
- ❌ No domain registration
- ❌ No lifecycle hooks
- ❌ No runtime wiring
- ❌ No tests
- ❌ No core changes

---

## PASS / FAIL Criteria for STEP 1.1
**PASS when ALL are true:**
- [ ] `src/domainHost/` exists
- [ ] Only contract-level declarations exist
- [ ] No imports from `runtime`, `context`, `services`, or UI
- [ ] Core behavior unchanged

Until all boxes are checked → **STEP 1.1 = NOT PASS**

---

## Status
**STEP 1.1:** READY FOR REVIEW (not marked PASS)

