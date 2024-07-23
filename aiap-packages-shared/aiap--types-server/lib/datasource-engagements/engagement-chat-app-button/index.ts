export interface IEngagementChatAppButtonV1 {
  languageSelection?: {
    isUIFormEnabled?: boolean,
    validFor?: {
      milliseconds?: number
    }
  },
  consent?: {
    isUIFormEnabled?: boolean,
    fallback?: boolean,
    functions?: {
      retrieveUserConsent?: {
        name?: string,
        path?: Array<any>,
        resultParamPath?: Array<any>,
      },
      confirmUserConsent?: {
        name?: string,
        path?: Array<any>,
        inputParams?: Array<any>,
      }
    }
  },
  fastHideOnClick?: boolean,
  text?: {
    en?: {
      displayName?: string,
      consent?: {
        header?: string,
        description?: string,
        button?: any,
      },
      languageSelection?: {
        header?: string,
        languages?: Array<any>,
        button?: any,
      }
    },
    de?: {
      displayName?: string,
      consent?: {
        header?: string,
        description?: string,
        button?: any,
      },
      languageSelection?: {
        header?: string,
        languages?: Array<any>,
        button?: any,
      },
    },
    fi?: {
      displayName?: string,
      consent?: {
        header?: string,
        description?: string,
        button?: any,
      },
      languageSelection?: {
        header?: string,
        languages?: Array<any>,
        button?: any,
      },
    },
    lt?: {
      displayName?: string,
      consent?: {
        header?: string,
        description?: string,
        button?: any,
      },
      languageSelection?: {
        header?: string,
        languages?: Array<any>,
        button?: any,
      },
    },
  },
}
