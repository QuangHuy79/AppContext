import { Guards } from "../RuntimeGuard";

export function guardSettings(snapshot) {
  const s = snapshot.settings;
  if (!s) return false;

  return Guards.enum(
    s.theme,
    ["light", "dark", "system"],
    "settings.theme",
    "RG-SET-01"
  );
}
