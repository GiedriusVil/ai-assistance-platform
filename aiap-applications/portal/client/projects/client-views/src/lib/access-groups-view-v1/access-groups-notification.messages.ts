const CONFIG = {
  target: ".notification-container",
  duration: 4000
};

export const ACCESS_GROUPS_NOTIFICATION = {
  SUCCESS: {
    ADD_ACCESS_GROUP: {
      type: "success",
      title: "Access Group",
      message: "Access Group created",
      ...CONFIG,
    },
    UPDATE_ACCESS_GROUP: {
      type: "success",
      title: "Access Group",
      message: "Access group updated",
      ...CONFIG,
    },
    DELETE_ACCESS_GROUP: {
      type: "success",
      title: "Access Group",
      message: "Access group deleted",
      ...CONFIG,
    },
  },
  WARNING: {
  },
  ERROR: {
    GET_ACCESS_GROUPS: {
      type: "error",
      title: "Access Groups",
      message: "Unable to get access groups",
      ...CONFIG,
    },
    GET_ASSISTANTS: {
      type: "error",
      title: "Assistants",
      message: "Unable to get assistants",
      ...CONFIG,
    },
    GET_TENANTS: {
      type: "error",
      title: "Tenants",
      message: "Unable to get tenants",
      ...CONFIG,
    },
    ADD_ACCESS_GROUP: {
      type: "error",
      title: "Access Group",
      message: "Unable create access group",
      ...CONFIG,
    },
    UPDATE_ACCESS_GROUP: {
      type: "error",
      title: "Access Group",
      message: "Unable update access group",
      ...CONFIG,
    },
    DELETE_ACCESS_GROUP: {
      type: "error",
      title: "Access Group",
      message: "Unable delete access group",
      ...CONFIG,
    },
    FORM_ACCESS_GROUP: {
      type: "error",
      title: "Access Groups",
      message: "Form is invalid, please double check your entries",
      ...CONFIG,
    },
  }
};

