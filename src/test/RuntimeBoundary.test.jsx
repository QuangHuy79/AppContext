// src/test/RuntimeBoundary.test.jsx
import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RuntimeBoundary } from "../AppRuntime/RuntimeBoundary";

const Thrower = () => {
  throw new Error("Boom!");
};

describe("RuntimeBoundary", () => {
  it("renders children normally if no error", () => {
    render(
      <RuntimeBoundary>
        <div data-testid="child">Child</div>
      </RuntimeBoundary>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders default fallback when child throws", () => {
    render(
      <RuntimeBoundary>
        <Thrower />
      </RuntimeBoundary>
    );
    expect(screen.getByText(/Cluster failed to load/i)).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    const fallback = <div data-testid="custom-fallback">Custom fallback</div>;
    render(
      <RuntimeBoundary fallback={fallback}>
        <Thrower />
      </RuntimeBoundary>
    );
    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
  });

  it("renders fallback with correct clusterName", () => {
    render(
      <RuntimeBoundary clusterName="Security">
        <Thrower />
      </RuntimeBoundary>
    );
    expect(screen.getByText(/Security failed to load/i)).toBeInTheDocument();
  });
});
