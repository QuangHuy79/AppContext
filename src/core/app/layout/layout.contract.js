// src/app/layout/layout.contract.js
/**
 * LayoutConfig Contract
 *
 * @typedef {Object} LayoutRegion
 * @property {string} name - unique region id
 * @property {boolean} [optional]
 */

/**
 * @typedef {Object} LayoutConfig
 * @property {string} defaultRegion
 * @property {LayoutRegion[]} regions
 */

export const DEFAULT_LAYOUT_CONFIG = {
  defaultRegion: "main",
  regions: [{ name: "main" }],
};
