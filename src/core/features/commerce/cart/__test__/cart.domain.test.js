// // src/domains/cart/__test__/cart.domain.test.js
// import { describe, it, expect } from "vitest";
// import cartDomain from "../index";
// // import { registerDomain } from "../../../domainHost/domainRegistry.contract";
// import { registerDomain } from "../../../domainHost";

// describe("BƯỚC 5.1 — Cart domain minimal", () => {
//   it("registers without throwing", () => {
//     expect(() => registerDomain(cartDomain)).not.toThrow();
//   });

//   it("declares DomainRegistryContract shape", () => {
//     expect(cartDomain.id).toBe("cart");
//     expect(typeof cartDomain.name).toBe("string");
//     expect(Array.isArray(cartDomain.capabilities)).toBe(true);
//   });
// });

// =====================================
// src/domains/cart/__test__/cart.domain.test.js

import cartDomain from "../index";
import { describe, it, expect } from "vitest";
// import { registerDomain } from "../../../domainHost/domainRegistry.contract";
import { registerDomain } from "../../../../../domainHost/domainHost";

describe("BƯỚC 5.2 — Cart domain minimal", () => {
  it("registers to domainHost without throwing", () => {
    expect(() => registerDomain(cartDomain)).not.toThrow();
  });

  it("declares minimal DomainRegistryContract shape", () => {
    expect(cartDomain.id).toBe("cart");
    expect(typeof cartDomain.name).toBe("string");
    expect(Array.isArray(cartDomain.capabilities)).toBe(true);
  });
});
