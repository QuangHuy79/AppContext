// // // src/app/AppShell.jsx
// // import React from "react";
// // export default function AppShell({ children }) {
// //   return (
// //     <div data-app-shell="true" className="app-shell">
// //       <div className="app-shell__viewport">{children}</div>

// //       <div id="app-overlay-root" />
// //     </div>
// //   );
// // }

// // ======================================
// // src/app/AppShell.jsx
// import React from "react";
// import { DEFAULT_LAYOUT_CONFIG } from "./layout/layout.contract";
// import { validateLayoutConfig } from "./layout/layout.validate";

// export default function AppShell({ children }) {
//   const layoutConfig = DEFAULT_LAYOUT_CONFIG;

//   const result = validateLayoutConfig(layoutConfig);

//   if (!result.ok) {
//     if (import.meta.env.DEV) {
//       throw new Error("[Layout Invalid] " + result.error);
//     } else {
//       console.error("[Layout Invalid]", result.error);
//     }
//   }

//   return (
//     <div data-app-shell="true" className="app-shell">
//       <div className="app-shell__viewport">{children}</div>

//       <div id="app-overlay-root" />
//     </div>
//   );
// }

// ===================================
// src/app/AppShell.jsx
import React, { useMemo } from "react";
import { DEFAULT_LAYOUT_CONFIG } from "./layout/layout.contract";
import { validateLayoutConfig } from "./layout/layout.validate";
import { LayoutContext } from "./layout/LayoutContext";

export default function AppShell({ children }) {
  const layoutConfig = DEFAULT_LAYOUT_CONFIG;

  const result = validateLayoutConfig(layoutConfig);
  if (!result.ok) {
    if (import.meta.env.DEV) {
      throw new Error("[Layout Invalid] " + result.error);
    } else {
      console.error("[Layout Invalid]", result.error);
    }
  }

  // Internal Region Registry
  const registry = useMemo(() => {
    const map = {};
    layoutConfig.regions.forEach((region) => {
      map[region.name] = {
        name: region.name,
      };
    });
    return map;
  }, [layoutConfig]);

  const contextValue = useMemo(() => {
    return {
      registry,
      defaultRegion: layoutConfig.defaultRegion,
    };
  }, [registry, layoutConfig.defaultRegion]);

  return (
    <LayoutContext.Provider value={contextValue}>
      <div data-app-shell="true" className="app-shell">
        <div className="app-shell__viewport">{children}</div>

        <div id="app-overlay-root" />
      </div>
    </LayoutContext.Provider>
  );
}
