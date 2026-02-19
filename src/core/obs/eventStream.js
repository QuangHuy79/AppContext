// src/obs/eventStream.js
export function emitEvent(name, payload) {
  if (!window.__APP_EVENTS__) {
    window.__APP_EVENTS__ = [];
  }

  window.__APP_EVENTS__.push({
    name,
    time: Date.now(),
    payload,
  });
}
