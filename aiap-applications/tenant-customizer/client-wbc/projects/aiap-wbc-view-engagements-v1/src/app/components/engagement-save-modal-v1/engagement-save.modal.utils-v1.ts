/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const DEFAULT_ENGAGEMENT_CHAT_APP: any = {
  version: '0.1.0',
  feedbackModal: {},
  voice: false,
  header: {
    survey: true,
    audio: true,
    transcript: true
  },
  headerActions: {
    chat: true,
    basket: true,
    survey: true,
    profile: true,
    identification: {
      conditions: [
        {
          path: [
            'channel',
            'id'
          ],
          values: 'genesys-sports_and_culture'
        },
        {
          path: [
            'gAcaProps',
            'identificationStatus'
          ],
          values: [
            'undefined',
            'failed'
          ]
        }
      ],
      redirectHost: 'http://localhost:3000',
      redirectPath: '/demo/redirect',
      targetHost: 'http://localhost:3000',
      targetPath: '/demo/mockIdentification'
    }
  },
  headerActionsHeight: 50,
  attachments: {
    ACA_ERROR: true,
    ACA_DEBUG: true
  },
  messages: {
    icons: {
      enabled: true
    }
  },
  assets: {
    icons: {
      openChatIcon: {
        fileName: '',
        style: {}
      },
      openChatMobile: {
        fileName: ''
      },
      buttonCloseChat: {
        fileName: '',
        style: {}
      },
      feedback: {
        positive: {
          url: 'http://localhost:3000/assets/coh-feedback-positive.svg'
        },
        selectedPositive: {
          url: 'http://localhost:3000/assets/coh-feedback-positive-green.svg'
        },
        negative: {
          url: 'http://localhost:3000/assets/coh-feedback-negative.svg'
        },
        selectedNegative: {
          url: 'http://localhost:3000/assets/coh-feedback-negative-red.svg'
        }
      }
    }
  }
};

const DEFAULT_ENGAGEMENT_CHAT_APP_BUTTON: any = {
  consent: {
    isUIFormEnabled: true,
    fallback: false,
    functions: {
      retrieveUserConsent: {
        name: "getUserConsentFromLocalStorage",
        path: [
          "aiap"
        ],
        resultParamPath: [
          "consent",
          "chat-app"
        ]
      },
      confirmUserConsent: {
        name: "setUserConsentToLocalStorage",
        path: [
          "aiap"
        ],
        inputParams: [
          "chat-app",
          true
        ]
      }
    },
  },
  fastHideOnClick: true,
  text: {
    en: {
      displayName: "AI Assistant",
      consent: {
        header: "Chat uses cookies",
        description: "Chat App requires functional chat cookies to function. By using a chat, you automatically accept the functional cookies it requires.",
        button: {
          agree: "Accept",
          discard: "Discard"
        }
      }
    }
  }
};

const DEFAULT_ENGAGEMENT_CHAT_APP_SERVER: any = {
  voiceServices: {
    sttServiceId: 'sttServiceId',
    ttsServiceId: 'ttsServiceId'
  }
}

const DEFAULT_ENGAGEMENT_SOE: any = {
  classifier: {
    model: undefined
  }
};

const DEFAULT_ENGAGEMENT_SLACK: any = {};

export const DEFAULT_ENGAGEMENT: any = {
  id: undefined,
  name: undefined,
  assistant: undefined,
  assistantDisplayName: undefined,
  styles: {
    value: undefined,
  },
  chatApp: DEFAULT_ENGAGEMENT_CHAT_APP,
  chatAppButton: DEFAULT_ENGAGEMENT_CHAT_APP_BUTTON,
  chatAppServer: DEFAULT_ENGAGEMENT_CHAT_APP_SERVER,
  soe: DEFAULT_ENGAGEMENT_SOE,
  slack: DEFAULT_ENGAGEMENT_SLACK,
};
