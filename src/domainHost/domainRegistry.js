// // // src/domainHost/domainRegistry.js
// // import { enforceDomainForbidden } from "./domainForbidden.guard";

// // export function registerDomain(domain) {
// //   enforceDomainForbidden(domain);
// // }

// // ================================
// // BUILD THẲNG — domainRegistry.js (PHIÊN BẢN 8.4)
// // src/domainHost/domainRegistry.js
// import { enforceDomainForbidden } from "./domainForbidden.guard";

// const domainStore = new Map();

// /**
//  * Register a domain into DomainHost
//  * Architecture stress point:
//  * - unlimited domains
//  * - no core mutation
//  * - no cross-domain awareness
//  */
// export function registerDomain(domain) {
//   if (!domain || typeof domain !== "object") {
//     throw new Error("Invalid domain");
//   }

//   enforceDomainForbidden(domain);

//   const { name } = domain;

//   if (!name) {
//     throw new Error("Domain must have a name");
//   }

//   if (domainStore.has(name)) {
//     throw new Error(`Domain "${name}" already registered`);
//   }

//   domainStore.set(name, domain);
// }

// /**
//  * Internal use by DomainHost runtime only
//  */
// export function getRegisteredDomains() {
//   return Array.from(domainStore.values());
// }

// ===============================
// src/domainHost/domainRegistry.js
import { enforceDomainForbidden } from "./domainForbidden.guard";

const domains = [];

export function registerDomain(domain) {
  enforceDomainForbidden(domain);
  domains.push(domain);
}

export function getRegisteredDomains() {
  return [...domains];
}
