/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  ENUM_LIVE_METRIC_ID,
  ENUM_LIVE_TILE_METRIC_ID,
} from 'client-shared-utils';

const DEFAULT_FEATURES: any = {
  "showSystemMessagesToggle": false
};

const CONSTANT_COLOR_PALLETES = {
  GENERAL_MIX: {
    id: 'generalMix',
    colors: [
      '#89eda0',
      '#5b8121',
      '#8a3ffc',
      '#71cddd',
      '#5392ff',
      '#ff7eb6',
      '#34bc6e',
      '#bae6ff',
      '#95d13c',
      '#ffb000',
      '#fe8500',
      '#ff509e',
      '#9b82f3',
      '#89eda0',
      '#8a3ffc',
      '#71cddd',
      '#5392ff',
      '#ff7eb6',
      '#34bc6e',
      '#bae6ff',
      '#95d13c',
      '#ffb000',
      '#fe8500',
      '#ff509e',
      '#9b82f3',
      '#89eda0',
      '#8a3ffc',
      '#71cddd',
      '#5392ff',
      '#ff7eb6',
      '#34bc6e',
      '#bae6ff',
      '#95d13c',
      '#ffb000',
      '#fe8500',
      '#ff509e',
      '#9b82f3'
    ]
  },
  IBMBlueCyanTeal: {
    id: 'IBMBlueCyanTeal',
    colors: [
      '#001d6c',
      '#002d9c',
      '#0043ce',
      '#0f62fe',
      '#4589ff',
      '#78a9ff',
      '#a6c8ff',
      '#d0e2ff',
      '#003a6d',
      '#00539a',
      '#0072c3',
      '#1192e8',
      '#33b1ff',
      '#82cfff',
      '#bae6ff',
      '#004144',
      '#005d5d',
      '#007d79',
      '#009d9a',
      '#08bdba',
      '#3ddbd9',
      '#9ef0f0'
    ]
  }
}

const DEFAULT_ROOT_CHART_JS = {
  layout: {
    padding: 10
  },
  plugins: {
    legend: {
      position: 'bottom'
    },
    datalabels: {
      anchor: 'end',
      align: 'top',
      offset: 1,
      clamp: true,
      clip: true,
      padding: {
        left: 0,
        right: 0,
        top: 20,
        bottom: 0
      }
    }
  },
  colors: CONSTANT_COLOR_PALLETES.IBMBlueCyanTeal,
}

const DEFAULT_FILTER = {};

const DEFAULT_N_FILTER = {
  userIds: ['120520638'],
};

const DEFAULT_TILES = [
  {
    id: 'conversationCountV1',
    name: 'Total Conversations',
    columnNumbers: "{'xlg': 2, 'lg': 4, 'md': 4, 'sm': 4}",
    metric: {
      id: ENUM_LIVE_TILE_METRIC_ID.CONVERSATIONS_COUNT_V1,
    }
  },
  {
    id: 'utterancesTransfersCountV1',
    name: 'Transfers to Agent',
    columnNumbers: "{'xlg': 2, 'lg': 4, 'md': 4, 'sm': 4}",
    metric: {
      id: ENUM_LIVE_TILE_METRIC_ID.UTTERANCES_TRANSFERS_COUNT_V1,
    }
  },
  {
    id: 'utterancesTransfersPercentageV1',
    name: 'Transfers to Agent(%)',
    columnNumbers: "{'xlg': 2, 'lg': 4, 'md': 4, 'sm': 4}",
    metric: {
      id: ENUM_LIVE_TILE_METRIC_ID.UTTERANCES_TRANSFERS_PERCENTAGE_V1,
    }
  },
  {
    id: 'messagesCountV1',
    name: 'Total Messages',
    columnNumbers: "{'xlg': 2, 'lg': 4, 'md': 4, 'sm': 4}",
    metric: {
      id: ENUM_LIVE_TILE_METRIC_ID.MESSAGES_COUNT_V1
    }
  },
  {
    id: 'messagesAvgPerConversationV1',
    name: 'Average Message Count',
    columnNumbers: "{'xlg': 2, 'lg': 4, 'md': 4, 'sm': 4}",
    metric: {
      id: ENUM_LIVE_TILE_METRIC_ID.MESSAGES_AVG_PER_CONVERSATION_V1
    }
  },
  {
    id: 'utterancesAvgPerConversationV1',
    name: 'Average Utterance Count',
    columnNumbers: "{'xlg': 2, 'lg': 4, 'md': 4, 'sm': 4}",
    metric: {
      id: ENUM_LIVE_TILE_METRIC_ID.UTTERANCES_AVG_PER_CONVERSATION_V1
    }
  },
  {
    id: 'utterancesFalsePositiveCountV1',
    name: 'Answered Messages',
    columnNumbers: "{'xlg': 2, 'lg': 4, 'md': 4, 'sm': 4}",
    tooltip: {
      text: 'The percentage is counted by deduction of action needed and false-positive utterances from all utterances.',
      position: 'top',
      alignment: 'end'
    },
    metric: {
      id: ENUM_LIVE_TILE_METRIC_ID.UTTERANCES_FALSE_POSITIVE_COUNT_V1
    }
  },
  {
    id: 'utterancesFalsePositivePercentageV1',
    name: 'Answered Messages(%)',
    columnNumbers: "{'xlg': 2, 'lg': 4, 'md': 4, 'sm': 4}",
    tooltip: {
      text: 'The percentage is counted by deduction of action needed and false-positive utterances from all utterances.',
      position: 'top',
      alignment: 'end'
    },
    metric: {
      id: ENUM_LIVE_TILE_METRIC_ID.UTTERANCES_FALSE_POSITIVE_PERCENTAGE_V1
    }
  }
];

const CONSTANTS_METRICS = {
  CONVERSATIONS_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.CONVERSATIONS_V1,
      name: 'Total Conversations',
      color: '#000000',
      chartType: 'line'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.CONVERSATIONS_V1,
    },
  },
  CONV_DURATION_AVG_IN_MINUTES_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.CONV_DURATION_AVG_IN_MINUTES_V1,
      name: 'Average Conversation Duration in Minutes',
      color: '#000000',
      chartType: 'line'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.CONV_DURATION_AVG_IN_MINUTES_V1,
    }
  },
  TRANSFERS_TO_AGENT_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.TRANSFERS_TO_AGENT_V1,
      name: 'Total Agent Transfers',
      color: '#000000',
      chartType: 'line'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.TRANSFERS_TO_AGENT_V1,
    },
  },
  MESSAGES_PER_CONVERSATION_AVG_COUNT_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.MESSAGES_PER_CONVERSATION_AVG_COUNT_V1,
      name: 'Average Messages per Conversation',
      color: '#000000',
      chartType: 'line'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.MESSAGES_PER_CONVERSATION_AVG_COUNT_V1,
    },
  },
  MESSAGES_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.MESSAGES_V1,
      name: 'Total Message Count',
      color: '#000000',
      chartType: 'line'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.MESSAGES_V1,
    }
  },
  CONVERSATIONS_WITH_USER_INTERACTION_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.CONVERSATIONS_WITH_USER_INTERACTION_V1,
      name: 'Conversations With User Interaction',
      color: '#000000',
      chartType: 'line'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.CONVERSATIONS_WITH_USER_INTERACTION_V1,
    },
  },
  CONVERSATIONS_WITHOUT_USER_INTERACTION_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.CONVERSATIONS_WITHOUT_USER_INTERACTION_V1,
      name: 'Conversations Without User Interaction',
      color: '#000000',
      chartType: 'line'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.CONVERSATIONS_WITHOUT_USER_INTERACTION_V1,
    },
  },
  TOP_INTENTS_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.TOP_INTENTS_V1,
      name: 'Top Intents',
      color: '#000000',
      chartType: 'pie'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.TOP_INTENTS_V1,
    }
  },
  TOP_INTENTS_WITH_FEEDBACK_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.TOP_INTENTS_WITH_FEEDBACK_V1,
      name: 'Top Intents with Improvement Feedback',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.TOP_INTENTS_WITH_FEEDBACK_V1,
    }
  },
  LOW_CONFIDENCE_INTENTS_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.LOW_CONFIDENCE_INTENTS_V1,
      name: 'Low Confidence Intents',
      color: '#000000',
      chartType: 'line'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.LOW_CONFIDENCE_INTENTS_V1,
    }
  },
  LAST_INTENT_BEFORE_TRANSFER_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.LAST_INTENT_BEFORE_TRANSFER_V1,
      name: 'Last Intent Before Transfer',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.LAST_INTENT_BEFORE_TRANSFER_V1,
    }
  },
  UTTERANCES_BY_SKILL_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.UTTERANCES_BY_SKILL_V1,
      name: 'Utterances by Skill',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.UTTERANCES_BY_SKILL_V1,
    }
  },
  CONVERSATIONS_V2: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.CONVERSATIONS_V2,
      name: 'Total Conversations',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.CONVERSATIONS_V2,
      filter: {},
      nFilter: {},
    }
  },
  USERS_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.USERS_V1,
      name: 'Total Users',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.USERS_V1,
      filter: {},
      nFilter: {},
    }
  },
  USERS_NEW_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.USERS_NEW_V1,
      name: 'New Users',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.USERS_NEW_V1,
      filter: {},
      nFilter: {},
    }
  },
  USERS_RETURNING_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.USERS_RETURNING_V1,
      name: 'Returning Users',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.USERS_RETURNING_V1,
      filter: {},
      nFilter: {},
    }
  },
  USERS_FROM_LANDING_PAGE_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.USERS_FROM_LANDING_PAGE_V1,
      name: 'Landing Page Users',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.USERS_FROM_LANDING_PAGE_V1,
      filter: {
        channelMeta: {
          hostname: "https://w3.ibm.com/buyatibm"
        }
      },
      nFilter: {},
    }
  },
  USERS_FROM_S2P_PAGE_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.USERS_FROM_S2P_PAGE_V1,
      name: 'S2P Users',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.USERS_FROM_S2P_PAGE_V1,
      filter: {
        channelMeta: {
          hostname: "https://va-prod.dal1a.cirrus.ibm.com/#/home"
        }
      },
      nFilter: {},
    }
  },
  USERS_FROM_SLACK_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.USERS_FROM_SLACK_V1,
      name: 'Slack Users',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.USERS_FROM_SLACK_V1,
      filter: {
        channelMeta: {
          type: "Slack"
        }
      },
      nFilter: {},
    }
  },
  SURVEYS_POSITIVE_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.SURVEYS_POSITIVE_V1,
      name: 'Positive Surveys',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.SURVEYS_POSITIVE_V1,
      filter: {},
      nFilter: {},
    }
  },
  SURVEYS_POSITIVE_TARGET_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.SURVEYS_POSITIVE_TARGET_V1,
      name: 'Positive Surveys Target',
      color: '#000000',
      chartType: 'line'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.SURVEYS_POSITIVE_TARGET_V1,
      filter: {},
      nFilter: {},
    }
  },
  FEEDBACKS_POSITIVE_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.FEEDBACKS_POSITIVE_V1,
      name: 'Feedbacks Positive',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.FEEDBACKS_POSITIVE_V1,
      filter: {},
      nFilter: {},
    }
  },
  FEEDBACKS_POSITIVE_TARGET_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.FEEDBACKS_POSITIVE_TARGET_V1,
      name: 'Feedbacks Positive Target',
      color: '#000000',
      chartType: 'line'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.FEEDBACKS_POSITIVE_TARGET_V1,
      filter: {},
      nFilter: {},
    }
  },
  RESPONSE_CONFIDENCE_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.RESPONSE_CONFIDENCE_V1,
      name: 'Response Confidence',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.RESPONSE_CONFIDENCE_V1,
      filter: {},
      nFilter: {},
    }
  },
  RESPONSE_CONFIDENCE_TARGET_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.RESPONSE_CONFIDENCE_TARGET_V1,
      name: 'Response Confidence Target',
      color: '#000000',
      chartType: 'line'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.RESPONSE_CONFIDENCE_TARGET_V1,
      filter: {},
      nFilter: {},
    }
  },
  USAGE_BY_COUNTRY_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_COUNTRY_V1,
      name: 'Usage by country',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_COUNTRY_V1,
      filter: {},
      nFilter: {},
    }
  },
  USAGE_BY_GROUP_TRANSFER_TO_AGENT_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_TRANSFER_TO_AGENT_V1,
      name: 'Usage by group: Connect to Agent',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_TRANSFER_TO_AGENT_V1,
      filter: {
        entities: ['problemType', 'liveOrTicket', 'names_contextual', 'country'],
      },
      nFilter: {}
    }
  },
  USAGE_BY_GROUP_GOODS_REQUESTS_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_GOODS_REQUESTS_V1,
      name: 'Usage by group: Goods Requests',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_GOODS_REQUESTS_V1,
      filter: {
        entities: ['hardware', 'officeSupplies', 'software', 'country']
      },
      nFilter: {}
    }
  },
  USAGE_BY_GROUP_ACCOUNTING_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_ACCOUNTING_V1,
      name: 'Usage by group: Accounting',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_ACCOUNTING_V1,
      filter: {
        entities: ['AccountingFieldsDefinition', 'ModifyAccountingFields', 'isCatalog', 'isNonCatalog']
      }
    }
  },
  USAGE_BY_GROUP_APPROVER_FLOW_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_APPROVER_FLOW_V1,
      name: 'Usage by group: Approver Flow',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_APPROVER_FLOW_V1,
      filter: {
        entities: ['error_message']
      },
      nFilter: {}
    }
  },
  USAGE_BY_GROUP_ERROR_MESSAGE_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_ERROR_MESSAGE_V1,
      name: 'Usage by group: Error Message',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_ERROR_MESSAGE_V1,
      filter: {
        entities: ['AlterationFlow', 'approvalChangeType']
      },
      nFilter: {}
    }
  },
  USAGE_BY_GROUP_BUYER_INFORMATION_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_BUYER_INFORMATION_V1,
      name: 'Usage by group: Buyer Information',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_BUYER_INFORMATION_V1,
      filter: {
        entities: ['business_unit']
      },
      nFilter: {}
    }
  },
  POP_CHATS_FROM_VA_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.POP_CHATS_FROM_VA_V1,
      name: 'Total POP Chats from VA',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.POP_CHATS_FROM_VA_V1,
      filter: {
        response: {
          text: "Getting you connected with a POP"
        }
      },
      nFilter: {},
    }
  },
  POP_TICKETS_FROM_VA_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.POP_TICKETS_FROM_VA_V1,
      name: 'Total POP Tickets from VA',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.POP_TICKETS_FROM_VA_V1,
      filter: {
        response: {
          text: "Opening a POP ticket"
        }
      },
      nFilter: {},
    }
  },
  PSIS_TICKETS_FROM_VA_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.PSIS_TICKETS_FROM_VA_V1,
      name: 'Total PSIS Tickets from VA',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.PSIS_TICKETS_FROM_VA_V1,
      filter: {
        response: {
          text: "Opening a PSIS ticket"
        }
      },
      nFilter: {},
    }
  },
  POP_AND_PSIS_CHATS_TICKETS_FROM_VA_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.POP_AND_PSIS_CHATS_TICKETS_FROM_VA_V1,
      name: 'Total PSIS Tickets from VA',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.POP_AND_PSIS_CHATS_TICKETS_FROM_VA_V1,
      filter: {
        responses: [
          "Getting you connected with a POP",
          "Opening a POP ticket",
          "Opening a PSIS ticket"
        ]
      },
      nFilter: {},
    }
  },
  POP_CHATS_FROM_ZENDESK_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.POP_CHATS_FROM_ZENDESK_V1,
      name: 'Total POP Chats from Zendesk',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.POP_CHATS_FROM_ZENDESK_V1,
      filter: {},
      nFilter: {},
    }
  },
  POP_TICKETS_FROM_ZENDESK_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.POP_TICKETS_FROM_ZENDESK_V1,
      name: 'Total POP Tickets from Zendesk',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.POP_TICKETS_FROM_ZENDESK_V1,
      filter: {},
      nFilter: {},
    }
  },
  PSIS_TICKETS_FROM_ZENDESK_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.PSIS_TICKETS_FROM_ZENDESK_V1,
      name: 'Total PSIS Tickets from Zendesk',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.PSIS_TICKETS_FROM_ZENDESK_V1,
      filter: {},
      nFilter: {},
    }
  },
  POP_AND_PSIS_CHATS_AND_TICKETS_V1: {
    FRONTEND: {
      id: ENUM_LIVE_METRIC_ID.POP_AND_PSIS_CHATS_AND_TICKETS_V1,
      name: 'Total POP Chats Tickets and PSIS Tickets from Zendesk',
      color: '#000000',
      chartType: 'bar'
    },
    BACKEND: {
      id: ENUM_LIVE_METRIC_ID.POP_AND_PSIS_CHATS_AND_TICKETS_V1,
      filter: {},
      nFilter: {},
    }
  }
}

const DEFAULT_METRICS = [
  CONSTANTS_METRICS.CONVERSATIONS_V1.BACKEND,
  CONSTANTS_METRICS.CONV_DURATION_AVG_IN_MINUTES_V1.BACKEND,
  CONSTANTS_METRICS.TRANSFERS_TO_AGENT_V1.BACKEND,
  CONSTANTS_METRICS.MESSAGES_PER_CONVERSATION_AVG_COUNT_V1.BACKEND,
  CONSTANTS_METRICS.MESSAGES_V1.BACKEND,
  CONSTANTS_METRICS.CONVERSATIONS_WITH_USER_INTERACTION_V1.BACKEND,
  CONSTANTS_METRICS.CONVERSATIONS_WITHOUT_USER_INTERACTION_V1.BACKEND,
  CONSTANTS_METRICS.TOP_INTENTS_V1.BACKEND,
  CONSTANTS_METRICS.TOP_INTENTS_WITH_FEEDBACK_V1.BACKEND,
  CONSTANTS_METRICS.LOW_CONFIDENCE_INTENTS_V1.BACKEND,
  CONSTANTS_METRICS.LAST_INTENT_BEFORE_TRANSFER_V1.BACKEND,
  CONSTANTS_METRICS.UTTERANCES_BY_SKILL_V1.BACKEND,
  CONSTANTS_METRICS.CONVERSATIONS_V2.BACKEND,
  CONSTANTS_METRICS.USERS_V1.BACKEND,
  CONSTANTS_METRICS.USERS_NEW_V1.BACKEND,
  CONSTANTS_METRICS.USERS_RETURNING_V1.BACKEND,
  CONSTANTS_METRICS.USERS_FROM_LANDING_PAGE_V1.BACKEND,
  CONSTANTS_METRICS.USERS_FROM_S2P_PAGE_V1.BACKEND,
  CONSTANTS_METRICS.USERS_FROM_SLACK_V1.BACKEND,
  CONSTANTS_METRICS.SURVEYS_POSITIVE_V1.BACKEND,
  CONSTANTS_METRICS.SURVEYS_POSITIVE_TARGET_V1.BACKEND,
  CONSTANTS_METRICS.FEEDBACKS_POSITIVE_V1.BACKEND,
  CONSTANTS_METRICS.FEEDBACKS_POSITIVE_TARGET_V1.BACKEND,
  CONSTANTS_METRICS.RESPONSE_CONFIDENCE_V1.BACKEND,
  CONSTANTS_METRICS.RESPONSE_CONFIDENCE_TARGET_V1.BACKEND,
  CONSTANTS_METRICS.USAGE_BY_COUNTRY_V1.BACKEND,
  CONSTANTS_METRICS.USAGE_BY_GROUP_TRANSFER_TO_AGENT_V1.BACKEND,
  CONSTANTS_METRICS.USAGE_BY_GROUP_GOODS_REQUESTS_V1.BACKEND,
  CONSTANTS_METRICS.USAGE_BY_GROUP_ACCOUNTING_V1.BACKEND,
  CONSTANTS_METRICS.USAGE_BY_GROUP_APPROVER_FLOW_V1.BACKEND,
  CONSTANTS_METRICS.USAGE_BY_GROUP_ERROR_MESSAGE_V1.BACKEND,
  CONSTANTS_METRICS.USAGE_BY_GROUP_BUYER_INFORMATION_V1.BACKEND,
  CONSTANTS_METRICS.POP_CHATS_FROM_VA_V1.BACKEND,
  CONSTANTS_METRICS.POP_TICKETS_FROM_VA_V1.BACKEND,
  CONSTANTS_METRICS.PSIS_TICKETS_FROM_VA_V1.BACKEND,
  CONSTANTS_METRICS.POP_AND_PSIS_CHATS_TICKETS_FROM_VA_V1.BACKEND,
  CONSTANTS_METRICS.POP_CHATS_FROM_ZENDESK_V1.BACKEND,
  CONSTANTS_METRICS.POP_TICKETS_FROM_ZENDESK_V1.BACKEND,
  CONSTANTS_METRICS.PSIS_TICKETS_FROM_ZENDESK_V1.BACKEND,
  CONSTANTS_METRICS.POP_AND_PSIS_CHATS_AND_TICKETS_V1.BACKEND,
];


const DEFAULT_CHARTS = [
  {
    id: 'conversationsV1',
    name: 'Total Conversations',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.CONVERSATIONS_V1.FRONTEND,
    ]
  },
  {
    id: 'conversationDurationAvgInMinutesV1',
    name: 'Average Conversation Duration in Minutes',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.CONV_DURATION_AVG_IN_MINUTES_V1.FRONTEND,
    ]
  },
  {
    id: 'transfersToAgentV1',
    name: 'Total Agent Transfers',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.TRANSFERS_TO_AGENT_V1.FRONTEND
    ],
  },
  {
    id: 'messagesPerConversationAvgCountV1',
    name: 'Average Messages per Conversation',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.MESSAGES_PER_CONVERSATION_AVG_COUNT_V1.FRONTEND,
    ],
  },
  {
    id: 'messagesV1',
    name: 'Total Message Count',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.MESSAGES_V1.FRONTEND
    ],
  },
  {
    id: 'conversationsWithUserInteractionV1',
    name: 'Conversations With User Interaction',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.CONVERSATIONS_WITH_USER_INTERACTION_V1.FRONTEND
    ],
  },
  {
    id: 'conversationsWithoutUserInteractionV1',
    name: 'Conversations Without User Interaction',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.CONVERSATIONS_WITHOUT_USER_INTERACTION_V1.FRONTEND
    ],
  },
  {
    id: 'topIntentsV1',
    name: 'Top Intents',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.TOP_INTENTS_V1.FRONTEND,
    ],
  },
  {
    id: 'topIntentsWithFeedbackV1',
    name: 'Top Intents with Improvement Feedback',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.TOP_INTENTS_WITH_FEEDBACK_V1.FRONTEND
    ],
  },
  {
    id: 'lowConfidenceIntentsV1',
    name: 'Low Confidence Intents',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.LOW_CONFIDENCE_INTENTS_V1.FRONTEND,
    ],
  },
  {
    id: 'lastIntentBeforeTransferV1',
    name: 'Last Intent Before Transfer',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.LAST_INTENT_BEFORE_TRANSFER_V1.FRONTEND,
    ],
  },
  {
    id: 'utteranceBySkillV1',
    name: 'Utterances by Skill',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.UTTERANCES_BY_SKILL_V1.FRONTEND,
    ],
  },
  {
    id: 'overallV1',
    name: 'Overal',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.CONVERSATIONS_V2.FRONTEND,
      CONSTANTS_METRICS.USERS_V1.FRONTEND,
      CONSTANTS_METRICS.USERS_NEW_V1.FRONTEND,
      CONSTANTS_METRICS.USERS_RETURNING_V1.FRONTEND,
      CONSTANTS_METRICS.USERS_FROM_LANDING_PAGE_V1.FRONTEND,
      CONSTANTS_METRICS.USERS_FROM_S2P_PAGE_V1.FRONTEND,
      CONSTANTS_METRICS.USERS_FROM_SLACK_V1.FRONTEND,
    ],
  },
  {
    id: 'conversationsV2',
    name: 'Total Conversations',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.CONVERSATIONS_V2.FRONTEND
    ]
  },
  {
    id: 'vaUsers',
    name: 'Virtual Assistant Users',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.USERS_V1.FRONTEND,
      CONSTANTS_METRICS.USERS_NEW_V1.FRONTEND,
      CONSTANTS_METRICS.USERS_RETURNING_V1.FRONTEND,
      CONSTANTS_METRICS.USERS_FROM_LANDING_PAGE_V1.FRONTEND,
      CONSTANTS_METRICS.USERS_FROM_S2P_PAGE_V1.FRONTEND,
      CONSTANTS_METRICS.USERS_FROM_SLACK_V1.FRONTEND,
    ]
  },
  {
    id: 'surveysPositiveV1',
    name: 'Positive Surveys',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.SURVEYS_POSITIVE_V1.FRONTEND,
      CONSTANTS_METRICS.SURVEYS_POSITIVE_TARGET_V1.FRONTEND,
    ],
  },
  {
    id: 'feedbacksPositiveV1',
    name: 'Positive Feedbacks',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.FEEDBACKS_POSITIVE_V1.FRONTEND,
      CONSTANTS_METRICS.FEEDBACKS_POSITIVE_TARGET_V1.FRONTEND
    ],
  },
  {
    id: 'responseConfidenceV1',
    name: 'Response Confidence',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.RESPONSE_CONFIDENCE_V1.FRONTEND,
      CONSTANTS_METRICS.RESPONSE_CONFIDENCE_TARGET_V1.FRONTEND,
    ],
  },
  {
    id: 'supportTicketsAndChatsV1',
    name: 'Support Tickets and Chats',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.POP_CHATS_FROM_VA_V1.FRONTEND,
      CONSTANTS_METRICS.POP_TICKETS_FROM_VA_V1.FRONTEND,
      CONSTANTS_METRICS.PSIS_TICKETS_FROM_VA_V1.FRONTEND,
      CONSTANTS_METRICS.POP_AND_PSIS_CHATS_TICKETS_FROM_VA_V1.FRONTEND,
      CONSTANTS_METRICS.POP_AND_PSIS_CHATS_AND_TICKETS_V1.FRONTEND,
      CONSTANTS_METRICS.POP_CHATS_FROM_ZENDESK_V1.FRONTEND,
      CONSTANTS_METRICS.POP_TICKETS_FROM_ZENDESK_V1.FRONTEND,
      CONSTANTS_METRICS.PSIS_TICKETS_FROM_ZENDESK_V1.FRONTEND,
    ],
  },
  {
    id: 'liveAgentVsVirtualAssistantV1',
    name: 'Live Agent vs Chatbot',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.CONVERSATIONS_V2.FRONTEND,
      CONSTANTS_METRICS.USERS_V1.FRONTEND,
      CONSTANTS_METRICS.POP_CHATS_FROM_VA_V1.FRONTEND,
      CONSTANTS_METRICS.POP_TICKETS_FROM_VA_V1.FRONTEND,
      CONSTANTS_METRICS.PSIS_TICKETS_FROM_VA_V1.FRONTEND,
      CONSTANTS_METRICS.POP_AND_PSIS_CHATS_AND_TICKETS_V1.FRONTEND,
    ],
  },
  {
    id: 'usageByCountryV1',
    name: 'Usage by country',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.USAGE_BY_COUNTRY_V1.FRONTEND
    ]
  },
  {
    id: 'usageByGroupV1',
    name: 'Usage By Group',
    chartjs: {
      plugins: {
        legend: {
          position: 'bottom'
        },
      }
    },
    metrics: [
      CONSTANTS_METRICS.USAGE_BY_GROUP_TRANSFER_TO_AGENT_V1.FRONTEND,
      CONSTANTS_METRICS.USAGE_BY_GROUP_GOODS_REQUESTS_V1.FRONTEND,
      CONSTANTS_METRICS.USAGE_BY_GROUP_ACCOUNTING_V1.FRONTEND,
      CONSTANTS_METRICS.USAGE_BY_GROUP_APPROVER_FLOW_V1.FRONTEND,
      CONSTANTS_METRICS.USAGE_BY_GROUP_ERROR_MESSAGE_V1.FRONTEND,
      CONSTANTS_METRICS.USAGE_BY_GROUP_BUYER_INFORMATION_V1.FRONTEND,
    ]
  },
];

export const CONSTANTS_DEFAULT_LIVE_METRICS_CONFIGURATION: any = {
  name: undefined,
  configuration: {
    isDefault: false,
    chartjs: DEFAULT_ROOT_CHART_JS,
    features: DEFAULT_FEATURES,
    filter: DEFAULT_FILTER,
    nFilter: DEFAULT_N_FILTER,
    tiles: DEFAULT_TILES,
    charts: DEFAULT_CHARTS,
    metrics: DEFAULT_METRICS,
  }
}
