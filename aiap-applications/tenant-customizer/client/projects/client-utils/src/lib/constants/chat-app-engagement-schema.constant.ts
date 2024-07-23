/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
export const CHAT_APP_ENGAGEMENT_SCHEMA = {
  type: 'object',
  properties: {
    version: {
      type: 'string',
      enum: ['0.1.0', '0.2.0', '0.3.0']
    },
    loadBootstrap: {
      type: 'boolean'
    },
    leftPanel: {
      $ref: '#/leftPanel'
    },
    header: {
      $ref: '#/header'
    },
    suggestions: {
      $ref: '#/suggestions'
    },
    headerActions: {
      $ref: '#/headerActions'
    },
    headerHeight: {
      type: 'integer',
      minimum: 0
    },
    headerActionsHeight: {
      type: 'integer',
      minimum: 0
    },
    notifications: {
      $ref: '#/notifications'
    },
    assets: {
      $ref: '#/assets'
    },
    service: {
      type: 'object',
      properties: {
        botSocketIo: {
          $ref: '#/botSocketIo'
        }
      },
    },
    socketOptions: {
      $ref: '#/socketOptions'
    },
    contextRestore: {
      $ref: '#/contextRestore'
    },
    feedbackModal: {
      $ref: '#/feedbackModal'
    }
  },
  required: ['feedbackModal'],
  leftPanel: {
    type: 'object',
    properties: {
      options: {
        type: 'object',
        properties: {
          enabled: {
            type: 'boolean'
          },
          width: {
            type: 'string',
            pattern: '^\\d+$'
          }
        },
        required: ['enabled']
      },
      layout: {
        $ref: '#/leftPanelLayout'
      }
    },
    required: [
      'options'
    ],
    if: {
      properties: {
        options: {
          properties: {
            enabled: {
              const: true
            }
          }
        }
      }
    },
    then: {
      required: ['layout']
    }
  },
  leftPanelLayout: {
    type: 'array',
    items: {
      oneOf: [{
        type: 'object',
        properties: {
          component: {
            const: 'separator'
          }
        },
        required: ['component'],
      }, {
        type: 'object',
        properties: {
          component: {
            type: 'string'
          },
          host: {
            type: 'string',
            format: 'uri'
          },
          path: {
            type: 'string'
          }
        },
        patternProperties: {
          '^params(-.{2})?$': {
            type: 'object'
          }
        },
        required: ['component', 'host', 'path'],
      }]
    },
  },
  header: {
    type: 'object',
    properties: {
      survey: {
        type: 'boolean'
      },
      audio: {
        type: 'boolean'
      },
      transcript: {
        type: 'boolean'
      },
      transcriptTransform: {
        type: 'boolean'
      }
    },
  },
  suggestions: {
    type: 'object',
    properties: {
      enabled: {
        type: 'boolean'
      }
    },
    required: ['enabled']
  },
  headerActions: {
    type: 'object',
    properties: {
      chat: {
        $ref: '#/headerAction'
      },
      basket: {
        $ref: '#/headerAction'
      },
      survey: {
        $ref: '#/headerAction'
      },
      profile: {
        $ref: '#/headerAction'
      },
      identification: {
        $ref: '#/headerAction'
      }
    },
  },
  headerAction: {
    oneOf: [{
      type: 'boolean'
    }, {
      type: 'object',
      properties: {
        conditions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              path: {
                type: 'array',
                items: {
                  type: 'string'
                },
                minItems: 1,
              },
              values: {
                oneOf: [{
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  minItems: 1,
                }, {
                  type: 'string'
                }]
              }
            },
            required: ['path', 'values']
          },
          minItems: 1,
        },
        redirectHost: {
          type: 'string',
          format: 'uri'
        },
        redirectPath: {
          type: 'string'
        },
        targetHost: {
          type: 'string',
          format: 'uri'
        },
        targetPath: {
          type: 'string'
        }
      },
      required: ['conditions', 'redirectHost', 'redirectPath', 'targetHost', 'targetPath'],
    }]
  },
  notifications: {
    type: 'object',
    properties: {
      ACA_ERROR: {
        type: 'boolean'
      },
      ACA_DEBUG: {
        type: 'boolean'
      }
    },
  },
  assets: {
    type: 'object',
    properties: {
      icons: {
        $ref: '#/assetsIcons'
      }
    },
  },
  assetsIcons: {
    type: 'object',
    properties: {
      chatWindow: {
        type: 'object',
        properties: {
          leftPanel: {
            type: 'object',
            properties: {
              upArrow: {
                $ref: '#/icon'
              }
            },
          },
          productList: {
            type: 'object',
            properties: {
              defaultImage: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    format: 'uri'
                  },
                  fileName: {
                    type: 'string'
                  }
                },
              }
            },
          },
          headerPanel: {
            type: 'object',
            properties: {
              'plus-one': {
                $ref: '#/icon'
              },
              'minus-one': {
                $ref: '#/icon'
              },
              closeLeftPanelIcon: {
                $ref: '#/icon'
              },
              vaLogo: {
                $ref: '#/icon'
              },
              surveyPenIcon: {
                $ref: '#/icon'
              },
              transcriptTransform: {
                $ref: '#/icon'
              },
              volumeUp: {
                $ref: '#/icon'
              },
              volumeMute: {
                $ref: '#/icon'
              },
              download: {
                $ref: '#/icon'
              },
              minimize: {
                $ref: '#/icon'
              },
              close: {
                $ref: '#/icon'
              }
            },
          },
          footerPanel: {
            type: 'object',
            properties: {
              liveChatSessionClose: {
                $ref: '#/icon'
              },
              sendButton: {
                $ref: '#/icon'
              }
            },
          }
        },
      },
      openChatIcon: {
        $ref: '#/iconWithStyle'
      },
      openChatMobile: {
        $ref: '#/iconWithStyle'
      },
      buttonCloseChat: {
        $ref: '#/iconWithStyle'
      },
      feedback: {
        type: 'object',
        properties: {
          positive: {
            $ref: '#/iconWithUrl'
          },
          negative: {
            $ref: '#/iconWithUrl'
          },
          selectedPositive: {
            $ref: '#/iconWithUrl'
          },
          selectedNegative: {
            $ref: '#/iconWithUrl'
          }
        }
      }
    },
  },
  iconWithUrl: {
    type: 'object',
    oneOf: [
      {
        properties: {
          fileName: {
            type: 'string'
          }
        },
        required: ['fileName'],
      },
      {
        properties: {
          url: {
            type: 'string',
            format: 'uri'
          }
        },
        required: ['url'],
      }
    ]
  },
  icon: {
    type: 'object',
    properties: {
      fileName: {
        type: 'string'
      }
    },
    required: ['fileName']
  },
  iconWithStyle: {
    type: 'object',
    properties: {
      fileName: {
        type: 'string'
      },
      style: {
        type: 'object'
      }
    },
    required: ['fileName']
  },
  socketOptions: {
    type: 'object',
    properties: {
      withCredentials: {
        type: 'boolean'
      },
      transports: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      upgrade: {
        type: 'boolean'
      }
    },
    required: ['transports'],
  },
  botSocketIo: {
    type: 'object',
    properties: {
      socketOptions: {
        $ref: '#/socketOptions'
      },
      reconnection: {
        type: 'object',
        properties: {
          enabled: {
            type: 'boolean'
          },
          interval: {
            type: 'number'
          }
        },
      }
    },
  },
  contextRestore: {
    type: 'object',
    properties: {
      enabled: {
        type: 'boolean'
      },
      actions: {
        $ref: '#/contextRestoreActions'
      }
    },
    required: ['enabled'],
    if: {
      properties: {
        enabled: {
          const: true
        }
      }
    },
    then: {
      required: ['actions']
    }
  },
  contextRestoreActions: {
    type: 'object',
    properties: {
      buttons: {
        type: 'boolean'
      },
      dropdown: {
        type: 'boolean'
      },
      aiServiceSuggestions: {
        type: 'boolean'
      },
      buttonList: {
        type: 'boolean'
      },
      intentsMenu: {
        type: 'boolean'
      },
      table: {
        type: 'boolean'
      }
    },
  },
  feedbackModal: {
    type: 'object',
    properties: {
      wbc: {
        type: 'object',
        properties: {
          component: {
            type: 'string'
          },
          host: {
            type: 'string',
            format: 'uri'
          },
          path: {
            type: 'string'
          }
        }
      }
    },
    patternProperties: {
      '^params(-.{2})?$': {
        type: 'object'
      }
    }
  }
};

export const CHAT_APP_BUTTON_ENGAGEMENT_SCHEMA = {
  type: 'object',
  properties: {
    consent: {
      $ref: '#/consent'
    },
    fastHideOnClick: {
      $ref: '#/fastHideOnClick'
    },
    text: {
      $ref: '#/text'
    }
  },
  consent: {
    type: 'object',
    properties: {
      isUIFormEnabled: {
        type: 'boolean'
      },
      fallback: {
        type: 'boolean'
      },
      functions: {
        type: 'object',
        properties: {
          retrieveUserConsent: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              path: {
                type: 'array'
              },
              resultParamPath: {
                type: 'array'
              }
            },
            required: ['name', 'path', 'resultParamPath']
          },
          confirmUserConsent: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              path: {
                type: 'array'
              },
              inputParams: {
                type: 'array'
              }
            },
            required: ['name', 'path', 'inputParams']
          }
        },
        required: ['retrieveUserConsent', 'confirmUserConsent']
      },
    },
    required: ['functions']
  },
  fastHideOnClick: {
    type: 'boolean'
  },
  text: {
    type: 'object',
    patternProperties: {
      '^.{2}': {
        type: 'object',
        properties: {
          displayName: {
            type: 'string'
          },
          consent: {
            type: 'object',
            properties: {
              header: {
                type: 'string'
              },
              description: {
                type: 'string'
              },
              button: {
                type: 'object',
                properties: {
                  agree: {
                    type: 'string'
                  },
                  discard: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
