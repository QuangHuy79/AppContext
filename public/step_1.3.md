# STEP 1.3 — Domain Lifecycle Hooks

**Scope locked:** BƯỚC 1 / STEP 1.3 only.  
No domain logic. No real execution. No tests. No feature behavior.

---

## Goal
Define **formal lifecycle hook points** so that a domain *can* be mounted / unmounted **in theory**, without actually running any domain.

This step answers **one question only**:
> *Where are the legal moments a domain may enter or leave the system?*

---

## Constraints (Non‑Negotiable)
- Hooks are **declared**, not executed
- No domain imports
- No domain logic
- No side effects
- Runtime behavior must remain unchanged

---

## 📁 Folder impact
**NO new folders.**  
Only extend `src/domainHost/`.

```
src/
└── domainHost/
    ├── domainHost.contract.js
    ├── domainRegistry.contract.js
    ├── domainLifecycle.contract.js   ← NEW
    └── index.js
```

---

## 📄 Artifact — domainLifecycle.contract.js
**Purpose:** Declare lifecycle hook names and signatures, without implementation.

```js
// src/domainHost/domainLifecycle.contract.js

/**
 * DomainLifecycle defines WHEN a domain is allowed
 * to be attached or detached from the system.
 *
 * This is a contract only — no execution.
 */

export const DomainLifecycleContract = Object.freeze({
  /**
   * Called when a domain is mounted.
   * @param {object} domainRegistry
   */
  onMount(domainRegistry) {},

  /**
   * Called when a domain is unmounted.
   * @param {string} domainId
   */
  onUnmount(domainId) {},
});
```

---

## 📄 index.js (update)
Expose lifecycle contract alongside others.

```js
// src/domainHost/index.js

export { DomainHostContract } from './domainHost.contract';
export { DomainRegistryContract } from './domainRegistry.contract';
export { DomainLifecycleContract } from './domainLifecycle.contract';
```

---

## What STEP 1.3 explicitly does NOT do
- ❌ Does not execute lifecycle
- ❌ Does not attach real domains
- ❌ Does not integrate runtime
- ❌ Does not store state
- ❌ Does not validate order or timing

---

## PASS / FAIL Criteria for STEP 1.3
**PASS when ALL are true:**
- [ ] `domainLifecycle.contract.js` exists
- [ ] Only lifecycle hook declarations, no logic
- [ ] No imports from runtime / core / domain
- [ ] Core & runtime behavior unchanged

Until all boxes are checked → **STEP 1.3 = NOT PASS**

---

## Status
**STEP 1.3:** READY FOR REVIEW (not marked PASS)

