// // AppRuntimeClient.jsx (đã dọn – bản FULL)
// // src/runtime/AppRuntimeClient.jsx
// import React from "react";

// import { AppProvider } from "../context/AppContext";
// import { StatePersistenceProvider } from "../context/StatePersistenceContext";

// import RuntimeOrchestrator from "./RuntimeOrchestrator";
// import RuntimeDevGuard from "./RuntimeDevGuard";
// import ErrorBoundary from "../obs/ErrorBoundary";

// const AppRuntimeClient = ({ children }) => {
//   return (
//     <ErrorBoundary>
//       <StatePersistenceProvider persistKey="APP_STATE" version={2}>
//         <AppProvider>
//           <RuntimeDevGuard>
//             <RuntimeOrchestrator>{children}</RuntimeOrchestrator>
//           </RuntimeDevGuard>
//         </AppProvider>
//       </StatePersistenceProvider>
//     </ErrorBoundary>
//   );
// };

// export default AppRuntimeClient;

// =====================================
// src/runtime/AppRuntimeClient.jsx (FINAL – CLEAN – PROD READY)
// src/runtime/AppRuntimeClient.jsx
import React from "react";

import { AppProvider } from "../context/AppContext";
import { StatePersistenceProvider } from "../context/StatePersistenceContext";

import RuntimeOrchestrator from "./RuntimeOrchestrator";
import ErrorBoundary from "../obs/ErrorBoundary";

const AppRuntimeClient = ({ children }) => {
  return (
    <ErrorBoundary>
      <StatePersistenceProvider persistKey="APP_STATE" version={2}>
        <AppProvider>
          <RuntimeOrchestrator>{children}</RuntimeOrchestrator>
        </AppProvider>
      </StatePersistenceProvider>
    </ErrorBoundary>
  );
};

export default AppRuntimeClient;
