// // // src/domainHost/domainForbidden.guard.js
// // export function enforceDomainForbidden(domain) {
// //   const forbidden = ["window", "document", "localStorage", "sessionStorage"];

// //   forbidden.forEach((key) => {
// //     if (key in domain) {
// //       throw new Error(
// //         `[SECURITY] Domain "${domain.name || "anonymous"}" tried to access forbidden "${key}"`,
// //       );
// //     }
// //   });
// // }

// // ====================================
// // src/domainHost/domainForbidden.guard.js

// const FORBIDDEN_PROTOTYPES = [
//   Object.prototype,
//   Array.prototype,
//   Function.prototype,
// ];

// export function enforceDomainForbidden(domain) {
//   // 🔒 Freeze critical prototypes BEFORE domain init
//   FORBIDDEN_PROTOTYPES.forEach((proto) => {
//     if (!Object.isFrozen(proto)) {
//       Object.freeze(proto);
//     }
//   });
// }

// ==================================
// src/domainHost/domainForbidden.guard.js

/**
 * Domain boundary guard
 * - KHÔNG đụng global prototype
 * - KHÔNG freeze runtime
 * - CHỈ validate domain object
 * - Fail-fast nếu domain vượt biên
 */

export function enforceDomainForbidden(domain) {
  // 1. Domain phải tồn tại
  if (!domain) {
    throw new Error("[DOMAIN FORBIDDEN] domain is required");
  }

  // 2. Domain chỉ được là object hoặc function
  const type = typeof domain;
  if (type !== "object" && type !== "function") {
    throw new Error("[DOMAIN FORBIDDEN] invalid domain type");
  }

  // 3. Không cho phép prototype hack
  // Domain phải là plain object hoặc function thuần
  const proto = Object.getPrototypeOf(domain);
  if (
    proto !== Object.prototype &&
    proto !== Function.prototype &&
    proto !== null
  ) {
    throw new Error("[DOMAIN FORBIDDEN] invalid domain prototype");
  }

  // 4. Không cho phép domain là global prototype
  if (
    domain === Object.prototype ||
    domain === Array.prototype ||
    domain === Function.prototype
  ) {
    throw new Error("[DOMAIN FORBIDDEN] global prototype is not a domain");
  }

  // 5. Không cho phép override constructor (phòng boundary test)
  if (Object.prototype.hasOwnProperty.call(domain, "constructor")) {
    throw new Error("[DOMAIN FORBIDDEN] domain cannot define constructor");
  }

  // ✔ PASS → domain hợp lệ, cho đi tiếp
}
