// src/app/layout/layout.validate.js
export function validateLayoutConfig(config) {
  if (!config) {
    return { ok: false, error: "LayoutConfig is required" };
  }

  if (!config.defaultRegion) {
    return { ok: false, error: "defaultRegion is required" };
  }

  if (!Array.isArray(config.regions) || config.regions.length === 0) {
    return { ok: false, error: "regions must be a non-empty array" };
  }

  const regionNames = config.regions.map((r) => r.name);

  if (!regionNames.includes(config.defaultRegion)) {
    return {
      ok: false,
      error: "defaultRegion must exist in regions",
    };
  }

  const unique = new Set(regionNames);
  if (unique.size !== regionNames.length) {
    return {
      ok: false,
      error: "region names must be unique",
    };
  }

  return { ok: true };
}
