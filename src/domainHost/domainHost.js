// // // // // src/domainHost/domainHost.js
// // // // import { getRegisteredDomains } from "./domainRegistry";
// // // // // import { runDomainInit } from "./domainLifecycle.contract";
// // // // import { registerDomain } from "./domainLifecycle.contract";

// // // // /**
// // // //  * 🔒 DOMAIN HOST
// // // //  * Runtime-controlled domain attachment
// // // //  */
// // // // export function initDomainHost(ctx = {}) {
// // // //   const domains = getRegisteredDomains();

// // // //   domains.forEach((domain) => {
// // // //     try {
// // // //       if (typeof domain.init !== "function") return;
// // // //       runDomainInit(domain, ctx);
// // // //     } catch (err) {
// // // //       // 🔒 Core absorbs domain crash
// // // //     }
// // // //   });
// // // // }

// // // // ===================================
// // // // src/domainHost/domainHost.js
// // // import { registerDomain as runDomainRegister } from "./domainLifecycle.contract";

// // // export function registerDomain(domain, ctx = {}) {
// // //   try {
// // //     runDomainRegister(domain, ctx);
// // //   } catch (err) {
// // //     // 🔒 Core absorbs domain crash
// // //   }
// // // }

// // // ===================================
// // import { runDomainInit } from "./domainLifecycle.contract";
// // import { enforceDomainForbidden } from "./domainForbidden.guard";

// // export function registerDomain(domain, ctx = {}) {
// //   try {
// //     // 🔒 HARD BOUNDARY — freeze trước khi domain chạy
// //     enforceDomainForbidden(domain);

// //     if (!domain || typeof domain.init !== "function") {
// //       return;
// //     }

// //     runDomainInit(domain, ctx);
// //   } catch (err) {
// //     // 🔒 Core absorbs domain crash
// //   }
// // }

// // ==========================================
// // src/domainHost/domainHost.js
// import { registerDomain as runDomainInit } from "./domainLifecycle.contract";
// import { enforceDomainForbidden } from "./domainForbidden.guard";

// export function registerDomain(domain, ctx = {}) {
//   try {
//     // 🔒 HARD BOUNDARY
//     enforceDomainForbidden(domain);

//     if (!domain || typeof domain.init !== "function") {
//       return;
//     }

//     runDomainInit(domain);
//   } catch (err) {
//     // 🔒 Core absorbs domain crash
//   }
// }

// =================================
// src/domainHost/domainHost.js
import { registerDomain as runDomainInit } from "./domainLifecycle.contract";
import { enforceDomainForbidden } from "./domainForbidden.guard";

export function registerDomain(domain, ctx = {}) {
  try {
    // 🔒 HARD BOUNDARY
    enforceDomainForbidden(domain);

    if (!domain || typeof domain.init !== "function") {
      return;
    }

    return runDomainInit(domain); // ✅ FIX Ở ĐÂY
  } catch (err) {
    // 🔒 Core absorbs domain crash
  }
}
