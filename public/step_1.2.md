# STEP 1.2 — Domain Registration Mechanism

**Scope locked:** BƯỚC 1 / STEP 1.2 only.  
No domain logic. No lifecycle execution. No runtime wiring. No tests.

---

## Goal
Define a **formal, explicit registration mechanism** so that a domain can be **declared to exist** without being executed.

This step answers **one question only**:
> *How does a domain announce itself to the system, without touching core or runtime?*

---

## Constraints (Non‑Negotiable)
- Registration is **declarative**, not imperative
- Domain does **not** import runtime / core
- Runtime does **not** import domain
- No side effects, no execution
- Only contracts and data shape

---

## 📁 Folder impact
**NO new top-level folders.**  
Only **extend** the existing `src/domainHost/` introduced in STEP 1.1.

```
src/
└── domainHost/
    ├── domainHost.contract.js   (from 1.1)
    ├── domainRegistry.contract.js   ← NEW
    └── index.js
```

---

## 📄 Artifact — domainRegistry.contract.js
**Purpose:** Define how a domain is *registered as data*, not executed.

```js
// src/domainHost/domainRegistry.contract.js

/**
 * DomainRegistry defines the declarative shape
 * of how domains are announced to the system.
 *
 * No imports. No execution.
 */

export const DomainRegistryContract = Object.freeze({
  /**
   * Unique domain identifier
   */
  id: '',

  /**
   * Human readable name
   */
  name: '',

  /**
   * Domain version (semantic, opaque to core)
   */
  version: '0.0.0',

  /**
   * Capabilities this domain claims to provide
   * (strings only, no functions)
   */
  capabilities: [],
});
```

---

## 📄 index.js (update)
Expose registry contract alongside host contract.

```js
// src/domainHost/index.js

export { DomainHostContract } from './domainHost.contract';
export { DomainRegistryContract } from './domainRegistry.contract';
```

---

## What STEP 1.2 explicitly does NOT do
- ❌ Does not register a real domain
- ❌ Does not mount or attach anything
- ❌ Does not touch runtime
- ❌ Does not validate or enforce
- ❌ Does not execute lifecycle

---

## PASS / FAIL Criteria for STEP 1.2
**PASS when ALL are true:**
- [ ] `domainRegistry.contract.js` exists under `src/domainHost/`
- [ ] Registration is pure data shape (no functions, no imports)
- [ ] No domain or runtime references
- [ ] Core behavior unchanged

Until all boxes are checked → **STEP 1.2 = NOT PASS**

---

## Status
**STEP 1.2:** READY FOR REVIEW (not marked PASS)

