export interface IEngagementChatAppV1 {
  version?: string,
  loadBootstrap?: boolean,
  isFullscreen?: boolean,
  resizeEnabled?: boolean,
  dragEnabled?: boolean,
  socketOptions?: {
    withCredentials?: boolean,
    transports?: Array<string>,
  },
  feedbackModal?: {
    wbc?: {
      component?: string,
      host?: string,
      path?: string,
    },
    params?: {
      title?: string,
      description?: string,
      values?: Array<string>,
      placeholder?: {
        comment?: string,
        dropdown?: string,
      },
      submit?: {
        value?: string
      },
    },
    'params-lt'?: {
      title?: string,
      description?: string,
      values?: Array<string>,
      placeholder?: {
        comment?: string,
        dropdown?: string,
      },
      submit?: {
        value?: string,
      },
    },
  },
  leftPanel?: {
    options?: {
      enabled?: boolean,
      width?: string,
    },
    layout?: Array<
      {
        component?: string,
        host?: string,
        path?: string,
        params?: any,
        configs?: any,
      }
    >,
  },
  header?: {
    survey?: boolean,
    audio?: boolean,
    transcriptTransform?: boolean,
    icon?: boolean,
    closeButton?: boolean,
    minimizeButton?: boolean,
    grid?: {
      rows?: string,
      columns?: string
    },
    zoom?: boolean,
    rightIcon?: {
      enabled?: boolean,
      url?: string,
    },
    quickLinks?: {
      enabled?: boolean,
      data?: Array<any>,
    },
    underTitleText?: Array<
      {
        language?: string,
        text?: string,
      }
    >,
    languageChange?: {
      defaultLanguage?: string,
      languages?: Array<any>,
    },
    transcript?: boolean,
  },
  footer?: {
    transcript?: boolean,
    voice?: boolean,
    buttonIcon?: boolean,
  },
  suggestions?: {
    enabled?: boolean,
  },
  headerActions?: {
    chat?: boolean,
    basket?: boolean,
    survey?: boolean,
    profile?: boolean,
    identification?: {
      conditions?: Array<any>,
      redirectHost?: string,
      redirectPath?: string,
      targetHost?: string,
      targetPath?: string,
    },
  },
  footerHeight?: number,
  headerHeight?: number,
  headerActionsHeight?: number,
  notifications?: {
    ACA_ERROR?: boolean,
    ACA_DEBUG?: boolean,
  },
  assets?: {
    icons?: {
      openChatIcon?: {
        fileName?: string,
        style?: any,
      },
      chatWindow?: {
        headerPanel?: any,
        footerPanel?: any,
        contentModal?: any,
      },
      openChatMobile?: {
        fileName?: string,
        style?: any,
      },
      buttonCloseChat?: {
        fileName?: string,
        style?: any,
      },
      feedback?: {
        positive?: any,
        selectedPositive?: any,
        negative?: any,
        selectedNegative?: any,
      },
    },
  },
  messages?: {
    icons?: {
      enabled?: boolean,
    },
    js?: {
      host?: string,
      path?: string,
    },
  },
  grid?: {
    enabled?: boolean,
    rows?: {
      header?: string,
      content?: string,
      footer?: string,
    },
    columns?: {
      leftPanel?: string,
      content?: string,
      sideNav?: string,
      base?: string,
      rightPanel?: string,
    },
    contentGrid?: {
      row?: string,
      column?: string,
    },
    layouts?: Array<
      {
        component?: string,
        url?: string,
        placement?: string,
        gridColumn?: string,
        gridRow?: string,
      }
    >,
    width?: string,
    height?: string,
  },
  attachments?: {
    ACA_ERROR?: boolean,
    ACA_DEBUG?: boolean,
  },
  contextRestore?: {
    enabled?: boolean,
    actions?: {
      buttons?: boolean,
      dropdown?: boolean,
      aiServiceSuggestions?: boolean,
    },
  },
  voice?: boolean,
  layout?: {
    header?: {
      component?: string,
      url?: string,
    },
    sideNav?: {
      enabled?: boolean,
      component?: string,
      url?: string,
      params?: {
        top?: Array<any>,
        bottom?: Array<any>,
      },
    },
    leftPanel?: {
      enabled?: boolean,
      component?: string,
      url?: string,
    },
    rightPanel?: {
      enabled?: boolean,
      component?: string,
      url?: string,
    },
    base?: {
      component?: string,
      url?: string,
    },
  },
}
