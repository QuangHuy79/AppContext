// src/domains/product/__test__/product.domain.test.js
import { describe, it, expect } from "vitest";
import productDomain from "../index";
import { registerDomain } from "../../../../../domainHost/domainHost";

describe("BƯỚC 5.1 — Product domain minimal", () => {
  it("registers without throwing", () => {
    expect(() => registerDomain(productDomain)).not.toThrow();
  });

  it("declares DomainRegistryContract shape", () => {
    expect(productDomain.id).toBe("product");
    expect(typeof productDomain.name).toBe("string");
    expect(Array.isArray(productDomain.capabilities)).toBe(true);
  });
});
