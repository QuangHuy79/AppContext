// // src/domains/profile/profile.domain.js
// export const initialProfileState = {
//   name: "",
//   status: "idle",
// };

// export function updateProfile(state, intent) {
//   if (intent.type === "PROFILE/SET_NAME") {
//     if (!intent.payload) {
//       throw new Error("Name is required");
//     }

//     return {
//       ...state,
//       name: intent.payload,
//       status: "updated",
//     };
//   }

//   return state;
// }

// =================================
// src/domains/profile/profile.domain.js

const initialState = {
  name: "",
  status: "idle",
};

const PROFILE_INTENT = {
  SET_NAME: "PROFILE/SET_NAME",
};

function updateProfile(state, intent) {
  if (intent.type === PROFILE_INTENT.SET_NAME) {
    if (!intent.payload) {
      throw new Error("Name is required");
    }

    return {
      ...state,
      name: intent.payload,
      status: "updated",
    };
  }

  return state;
}

const profileDomain = {
  name: "profile",

  state: initialState,

  intent: PROFILE_INTENT,

  rule: {
    updateProfile,
  },

  init() {
    // 8.4 stress test:
    // domain mount được mà core không đổi
  },
};

export default profileDomain;
