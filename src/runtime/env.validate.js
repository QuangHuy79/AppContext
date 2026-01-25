// src/runtime/env.validate.js
export function validateEnv(env) {
  const errors = [];

  const required = ["VITE_APP_ENV", "VITE_BUILD_ID", "VITE_API_BASE_URL"];

  required.forEach((key) => {
    if (!env[key]) errors.push(`Missing ${key}`);
  });

  if (!["dev", "staging", "prod"].includes(env.VITE_APP_ENV)) {
    errors.push("Invalid VITE_APP_ENV");
  }

  return {
    ok: errors.length === 0,
    errors,
    signature: {
      appEnv: env.VITE_APP_ENV,
      buildId: env.VITE_BUILD_ID,
      apiBase: env.VITE_API_BASE_URL,
    },
  };
}
