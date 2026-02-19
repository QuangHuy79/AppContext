import RuntimeOrchestrator from "../RuntimeOrchestrator";
import { test, expect } from "vitest";
test("RuntimeOrchestrator does not import UI hosts", () => {
  const src = RuntimeOrchestrator.toString();

  expect(src).not.toMatch(/AdminHost/);
  expect(src).not.toMatch(/WebHost/);
});
