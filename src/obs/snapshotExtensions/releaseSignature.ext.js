// src/obs/snapshotExtensions/releaseSignature.ext.js
export function attachReleaseSignature(snapshot) {
  return {
    ...snapshot,
    release: {
      ...(snapshot.release || {}),
      signature: {
        env: import.meta.env.MODE,
        buildId: import.meta.env.VITE_BUILD_ID,
        persistedVersion: snapshot?.persistence?.version ?? null,
        timestamp: Date.now(),
      },
    },
  };
}
