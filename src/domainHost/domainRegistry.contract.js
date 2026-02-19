// // src/domainHost/domainRegistry.contract.js
// import { assertDomainShape } from "./domainForbidden.guard";
// export function registerDomain(domain) {
//   assertDomainShape(domain);
// }
// /**
//  * DomainRegistry defines the declarative shape
//  * of how domains are announced to the system.
//  *
//  * No imports. No execution.
//  */

// export const DomainRegistryContract = Object.freeze({
//   /**
//    * Unique domain identifier
//    */
//   id: "",

//   /**
//    * Human readable name
//    */
//   name: "",

//   /**
//    * Domain version (semantic, opaque to core)
//    */
//   version: "0.0.0",

//   /**
//    * Capabilities this domain claims to provide
//    * (strings only, no functions)
//    */
//   capabilities: [],
// });

// =========================================
// src/domainHost/domainRegistry.contract.js

/**
 * DomainRegistry defines the declarative shape
 * of how domains are announced to the system.
 *
 * No imports. No execution.
 */

export const DomainRegistryContract = Object.freeze({
  id: "",
  name: "",
  version: "0.0.0",
  capabilities: [],
});
