# STEP 1.4 — Isolation Test: Domain does NOT touch Core

**Scope locked:** BƯỚC 1 / STEP 1.4 only.  
This step exists ONLY to verify **structural isolation**.

---

## Goal
Prove that a **fake / empty domain** can be introduced into the system **without touching Core, Runtime, Context, or Services**.

This step answers **one question only**:
> *Can a domain exist as a concept without being a threat to core?*

---

## Constraints (Non‑Negotiable)
- Fake domain has **no logic**
- Fake domain does **not import core, runtime, context, services**
- Core code is **NOT modified**
- Runtime behavior is **NOT modified**
- Test is **structural**, not behavioral

---

## 📁 Folder impact
Add **one new folder** under `src/`:

```
src/
├── domainHost/
│   ├── domainHost.contract.js
│   ├── domainRegistry.contract.js
│   ├── domainLifecycle.contract.js
│   └── index.js
│
└── domains/
    └── __fake__/
        ├── domain.registry.js
        └── domain.lifecycle.js
```

---

## 📄 Artifact 1 — domain.registry.js (FAKE)
**Purpose:** Declare a domain that only announces its existence.

```js
// src/domains/__fake__/domain.registry.js

import { DomainRegistryContract } from '../../domainHost';

export const FakeDomainRegistry = {
  ...DomainRegistryContract,
  id: '__fake__',
  name: 'Fake Domain',
  version: '0.0.0',
  capabilities: [],
};
```

---

## 📄 Artifact 2 — domain.lifecycle.js (FAKE)
**Purpose:** Declare lifecycle hooks with NO behavior.

```js
// src/domains/__fake__/domain.lifecycle.js

import { DomainLifecycleContract } from '../../domainHost';

export const FakeDomainLifecycle = {
  ...DomainLifecycleContract,
};
```

---

## What this step explicitly does NOT do
- ❌ Does not register domain in runtime
- ❌ Does not mount domain
- ❌ Does not execute lifecycle
- ❌ Does not add feature code
- ❌ Does not add tests

---

## PASS / FAIL Criteria for STEP 1.4
**PASS when ALL are true:**
- [ ] `src/domains/__fake__/` exists
- [ ] Fake domain imports ONLY from `domainHost`
- [ ] No core / runtime / context files are modified
- [ ] App builds and runs exactly as before

If any core file must change → **STEP 1.4 FAIL**

---

## Status
**STEP 1.4:** READY FOR EXECUTION & REVIEW (not marked PASS)

