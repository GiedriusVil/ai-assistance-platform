const CONFIG = {
  target: ".notification-container",
  duration: 20000
};

export const USERS_MESSAGES = {
  SUCCESS: {
    ADD_USER: {
      type: "success",
      title: "User",
      message: "User profile created!",
      ...CONFIG,
    },
    UPDATE_USER: {
      type: "success",
      title: "User",
      message: "User profile updated!",
      ...CONFIG,
    },
    DELETE_USER: {
      type: "success",
      title: "User",
      message: "User profile deleted",
      ...CONFIG,
    },
  },
  WARNING: {},
  ERROR: {
    GET_USERS: {
      type: "error",
      title: "Users",
      message: "Unable to get users",
      ...CONFIG,
    },
    ADD_USER: {
      type: "error",
      title: "User",
      message: "Unable create user profile",
      ...CONFIG,
    },
    UPDATE_USER: {
      type: "error",
      title: "User",
      message: "Unable update user profile",
      ...CONFIG,
    },
    DELETE_USER: {
      type: "error",
      title: "User",
      message: "Unable delete user profile",
      ...CONFIG,
    },
  }
};

export const USERS_NOTIFICATION = USERS_MESSAGES;
