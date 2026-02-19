// src/runtime/__test__/hostRegistry.test.js
import { registerUIHost } from "../registerUIHost";
import { hostRegistry } from "../hostRegistry";
import { test, expect } from "vitest";
function DummyHost() {
  return null;
}

test("registerUIHost registers host correctly", () => {
  registerUIHost("test", DummyHost);
  expect(hostRegistry.test).toBe(DummyHost);
});
