// src/test/useRuntimeSnapshot.test.jsx
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  RuntimeSnapshotProvider,
  useRuntimeSnapshot,
} from "../AppRuntime/useRuntimeSnapshot";

const Child = ({ keyName }) => {
  const value = useRuntimeSnapshot(keyName);
  return <div data-testid="snapshot">{JSON.stringify(value)}</div>;
};

describe("useRuntimeSnapshot", () => {
  it("returns full snapshot if no key provided", () => {
    const snapshot = { a: 1, b: 2 };
    render(
      <RuntimeSnapshotProvider value={snapshot}>
        <Child />
      </RuntimeSnapshotProvider>
    );
    expect(screen.getByTestId("snapshot")).toHaveTextContent(
      JSON.stringify(snapshot)
    );
  });

  it("returns specific key value if key provided", () => {
    const snapshot = { a: 1, b: 2 };
    render(
      <RuntimeSnapshotProvider value={snapshot}>
        <Child keyName="b" />
      </RuntimeSnapshotProvider>
    );
    expect(screen.getByTestId("snapshot")).toHaveTextContent("2");
  });

  it("returns null if key does not exist", () => {
    const snapshot = { a: 1, b: 2 };
    render(
      <RuntimeSnapshotProvider value={snapshot}>
        <Child keyName="c" />
      </RuntimeSnapshotProvider>
    );
    expect(screen.getByTestId("snapshot")).toHaveTextContent("null");
  });
});
