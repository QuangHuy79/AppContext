import React from "react";
import { describe, test, expect } from "vitest";
import { render } from "@testing-library/react";

import { createUIHostRouter } from "../UIHostRouter.jsx";

describe("UIHostRouter (8.1)", () => {
  test("renders UIHost by hostKey", () => {
    const AdminHost = () => <div>ADMIN</div>;
    const WebHost = () => <div>WEB</div>;

    const UIHostRouter = createUIHostRouter({
      admin: AdminHost,
      web: WebHost,
    });

    const { getByText } = render(<UIHostRouter hostKey="admin" />);
    expect(getByText("ADMIN")).toBeTruthy();
  });

  test("throws if hostKey is missing", () => {
    const UIHostRouter = createUIHostRouter({});
    expect(() => render(<UIHostRouter />)).toThrow("hostKey is required");
  });

  test("throws if hostKey not registered", () => {
    const UIHostRouter = createUIHostRouter({});
    expect(() => render(<UIHostRouter hostKey="unknown" />)).toThrow(
      'UIHost "unknown" not registered',
    );
  });
});
