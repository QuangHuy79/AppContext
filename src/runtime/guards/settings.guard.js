// import { Guards } from "../RuntimeGuard";

// export function guardSettings(snapshot) {
//   const s = snapshot.settings;
//   if (!s) return false;

//   return Guards.enum(
//     s.theme,
//     ["light", "dark", "system"],
//     "settings.theme",
//     "RG-SET-01"
//   );
// }

// =========================================
// File final version
// src/runtime/guards/settings.guard.js
import { emitError } from "../../obs/errorSink";
import { Guards } from "../RuntimeGuard";

export function guardSettings(snapshot) {
  const s = snapshot?.settings;
  if (!s) {
    emitError({
      source: "RG-SET-00",
      message: "snapshot.settings is missing",
      snapshot,
    });
    return false;
  }

  const valid = Guards.enum(
    s.theme,
    ["light", "dark", "system"],
    "settings.theme",
    "RG-SET-01"
  );

  if (!valid) {
    emitError({
      source: "RG-SET-01",
      message: `settings.theme expected one of ['light','dark','system'], got '${s.theme}'`,
      snapshot,
    });
    return false;
  }

  return true;
}
