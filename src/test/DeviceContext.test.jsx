// import React from "react";
// import { render, screen } from "@testing-library/react";
// import { DeviceProvider, useDevice } from "../context/modules/DeviceContext";

// // Component test hiển thị device info
// const ShowDevice = () => {
//   const { width, type } = useDevice();
//   return <div data-testid="device">{`${type}-${width}`}</div>;
// };

// // Helper: mock innerWidth trong JSDOM
// const setScreenWidth = (width) => {
//   Object.defineProperty(window, "innerWidth", {
//     writable: true,
//     configurable: true,
//     value: width,
//   });
// };

// describe("DeviceContext", () => {
//   it("cập nhật thành mobile khi resize xuống < 640px", () => {
//     setScreenWidth(500); // set BEFORE render
//     render(
//       <DeviceProvider>
//         <ShowDevice />
//       </DeviceProvider>
//     );

//     // Trigger resize listener
//     window.dispatchEvent(new Event("resize"));

//     expect(screen.getByTestId("device").textContent).toBe("mobile-500");
//   });

//   it("cập nhật thành tablet khi resize 640–1023px", () => {
//     setScreenWidth(800); // set BEFORE render
//     render(
//       <DeviceProvider>
//         <ShowDevice />
//       </DeviceProvider>
//     );

//     window.dispatchEvent(new Event("resize"));

//     expect(screen.getByTestId("device").textContent).toBe("tablet-800");
//   });

//   it("báo lỗi đúng khi dùng useDevice ngoài Provider", () => {
//     const BrokenComponent = () => {
//       expect(() => useDevice()).toThrow(
//         "useDevice must be used inside DeviceProvider"
//       );
//       return <div>broken</div>;
//     };

//     render(<BrokenComponent />);
//   });
// });

// ========================
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { DeviceProvider, useDevice } from "../context/modules/DeviceContext";
import { describe, it, expect } from "vitest";
// Component test hiển thị device info
const TestComponent = () => {
  const { width, isMobile, isTablet, isDesktop } = useDevice();
  return (
    <div data-testid="device">
      {isMobile
        ? `mobile-${width}`
        : isTablet
        ? `tablet-${width}`
        : `desktop-${width}`}
    </div>
  );
};

// Helper resize window
const resizeWindow = (width, height = 768) => {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event("resize"));
};

describe("DeviceContext", () => {
  it("cập nhật thành mobile khi resize < 640px", async () => {
    render(
      <DeviceProvider>
        <TestComponent />
      </DeviceProvider>
    );

    resizeWindow(500);

    await waitFor(() => {
      expect(screen.getByTestId("device").textContent).toBe("mobile-500");
    });
  });

  it("cập nhật thành tablet khi resize 640–1023px", async () => {
    render(
      <DeviceProvider>
        <TestComponent />
      </DeviceProvider>
    );

    resizeWindow(800);

    await waitFor(() => {
      expect(screen.getByTestId("device").textContent).toBe("tablet-800");
    });
  });

  it("cập nhật thành desktop khi resize >=1024px", async () => {
    render(
      <DeviceProvider>
        <TestComponent />
      </DeviceProvider>
    );

    resizeWindow(1200);

    await waitFor(() => {
      expect(screen.getByTestId("device").textContent).toBe("desktop-1200");
    });
  });

  it("báo lỗi khi dùng useDevice ngoài Provider", () => {
    const Broken = () => {
      expect(() => useDevice()).toThrow(
        "useDevice must be used within DeviceProvider"
      );
      return null;
    };
    render(<Broken />);
  });
});
