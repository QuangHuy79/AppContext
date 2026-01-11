// // ErrorBoundary — version OBS-03
// // src/obs/ErrorBoundary.jsx
// import React from "react";
// import { captureError } from "./errorSink";
// import { normalizeBoundaryError } from "./normalizeBoundaryError";

// const __DEV__ = import.meta.env.DEV;

// let reported = false;

// export default class ErrorBoundary extends React.Component {
//   componentDidCatch(error, info) {
//     if (reported) return;
//     reported = true;

//     try {
//       captureError(normalizeBoundaryError(error, info));
//     } catch {
//       // invariant: boundary must not crash
//     }
//   }

//   render() {
//     if (reported) {
//       return __DEV__ ? (
//         <pre style={{ color: "red" }}>
//           {this.props.devMessage || "Render crashed. Check telemetry."}
//         </pre>
//       ) : null;
//     }

//     return this.props.children;
//   }
// }

// ======================================
// File đã sửa – FULL, drop-in replace
// src/obs/ErrorBoundary.jsx
// ErrorBoundary — OBS-03 (clean, no extra normalizer)
import React from "react";
import { captureError } from "./errorSink";
import { normalizeError } from "./normalizeError";

const __DEV__ = import.meta.env.DEV;

let reported = false;

export default class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    if (reported) return;
    reported = true;

    try {
      // Boundary chỉ cung cấp context, KHÔNG tự normalize riêng
      const normalized = normalizeError(error, {
        source: "ErrorBoundary",
        componentStack: info?.componentStack,
      });

      captureError(normalized);
    } catch {
      // invariant: observability must never crash app
    }
  }

  render() {
    if (reported) {
      return __DEV__ ? (
        <pre style={{ color: "red", padding: 16 }}>
          {this.props.devMessage || "Render crashed. Check telemetry."}
        </pre>
      ) : null;
    }

    return this.props.children;
  }
}
