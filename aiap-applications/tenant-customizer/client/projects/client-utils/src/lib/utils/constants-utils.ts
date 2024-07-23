/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const offset = { x: -170, y: 0 }

export const EXPORT_TYPE = {
  XLSX: 'XLSX',
  JSON: 'JSON'
};

export const VIEW_TYPES = {
  SINGLE_VIEW: 'SINGLE_VIEW',
  MULTI_VIEW: 'MULTI_VIEW'
};

export const MASKED_STRING = '******';

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc'
};

export const DEFAULT_TABLE = {
  PAGE: {
    ITEMS_PER_PAGE: 10,
    ITEMS_PER_PAGE_OPTIONS: [10, 20, 50, 100]
  },
  AI_SERVICES: {
    TYPE: 'AI_SERVICES',
    SORT: {
      field: 'name',
      direction: SORT_DIRECTION.ASC,
    },
  },
  AI_SKILLS: {
    TYPE: 'AI_SKILLS',
    SORT: {
      field: 'name',
      direction: SORT_DIRECTION.ASC,
    },
  },
  AI_SKILLS_RELEASES: {
    TYPE: 'AI_SKILLS_RELEASES',
    SORT: {
      field: 'createdT',
      direction: SORT_DIRECTION.ASC,
    },
  },
  USERS: {
    TYPE: 'Users',
    SORT: {
      field: 'username',
      direction: SORT_DIRECTION.ASC,
    },
    FIELD: {
      _ID: null,
      USERNAME: '',
      PASSWORD: '',
      ROLE: 'user',
      TIMEZONE: 'America/Danmarkshavn'
    }
  },
  AUDITS: {
    SORT: {
      FIELD: 'initiator',
      DIRECTION: SORT_DIRECTION.ASC,
      SORT_INDEX: 0
    },
    FIELD: {}
  },
  ACCESS_GROUPS: {
    TYPE: 'AccessGroups',
    SORT: {
      field: 'name',
      direction: SORT_DIRECTION.ASC,
    },
    FIELD: {}
  },
  TENANTS: {
    TYPE: 'Tenants',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },

  APPLICATIONS: {
    TYPE: 'Applications',
    SORT: {
      field: 'name',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  CONVERSATIONS: {
    TYPE: 'Conversations',
    SORT:
    {
      field: 'started',
      direction: SORT_DIRECTION.DESC,
    },
  },
  ASSISTANTS: {
    TYPE: 'Assistants',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.ASC,
    },
  },
  ENGAGEMENTS: {
    TYPE: 'Engagements',
    SORT: {
      field: 'name',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  ANSWER_STORES: {
    TYPE: 'AnswerStores',
    SORT:
    {
      field: 'id',
      direction: SORT_DIRECTION.DESC,
    },
  },
  ANSWERS: {
    TYPE: 'Answers',
    SORT:
    {
      field: 'key',
      direction: SORT_DIRECTION.DESC,
    },
  },
  LIVE_METRICS: {
    TYPE: 'LiveMetrics',
  },
  LIVE_METRICS_CONFIGURATIONS: {
    TYPE: 'LiveMetricsChanges',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.ASC
    }
  },
  DATA_MASKING_CONFIGURATIONS: {
    TYPE: 'DataMaskingConfigurations',
    SORT: {
      field: 'updated.date',
      direction: SORT_DIRECTION.DESC
    }
  },
  SURVEYS: {
    TYPE: 'Surveys',
    SORT:
    {
      field: 'created',
      direction: SORT_DIRECTION.DESC,
    },
  },
  UTTERANCES: {
    TYPE: 'Utterances',
    SORT:
    {
      field: 'timestamp',
      direction: 'desc',
    },
  },
  LAMBDA: {
    TYPE: 'Lambda',
    SORT:
    {
      field: 'id',
      direction: SORT_DIRECTION.DESC
    }
  },
  LAMBDA_CHANGES: {
    TYPE: 'LambdaChanges',
    SORT:
    {
      field: 'id',
      direction: SORT_DIRECTION.DESC
    }
  },
  LAMBDA_CONFIGURATIONS: {
    TYPE: 'LambdaConfigurations',
    SORT:
    {
      field: 'key',
      direction: SORT_DIRECTION.DESC
    }
  },
  LAMBDA_ERRORS: {
    TYPE: 'LambdaErrors',
    SORT:
    {
      field: 'timestamp',
      direction: SORT_DIRECTION.DESC
    }
  },
  UNSPSC_SEGMENTS: {
    TYPE: 'UNSPSCSegments',
    SORT:
    {
      field: 'id',
      direction: SORT_DIRECTION.DESC
    }
  },
  CLASSIFICATION_CATALOGS: {
    TYPE: 'ClassificationCatalogs',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC
    }
  },
  CLASSIFIER: {
    TYPE: 'Classifier',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC
    }
  },
  TESTS: {
    TYPE: 'Tests',
    SORT:
    {
      field: 'ended',
      direction: SORT_DIRECTION.DESC
    }
  },
  TEST: {
    TYPE: 'Test'
  },
  TEST_INTENTS: {
    TYPE: 'TestIntents',
    SORT:
    {
      field: 'recall',
      direction: SORT_DIRECTION.DESC
    }
  },
  TEST_MATRIX: {
    TYPE: 'TestMatrix',
    SORT:
    {
      field: 'value',
      direction: SORT_DIRECTION.DESC
    }
  },
  TEST_OVERALL: {
    TYPE: 'TestOverall',
  },
  TEST_RESULTS: {
    TYPE: 'TestResult',
    SORT:
    {
      field: 'confidence',
      direction: SORT_DIRECTION.DESC
    }
  },
  TEST_TABLE: {
    TYPE: 'TestTable',
  },
  TENANT_EVENT_STREAMS: {
    TYPE: 'TenantEventStreams',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC,
    },
  },
  TENANT_REDIS: {
    TYPE: 'TenantRedis',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC
    }
  },
  TENANT_APPLICATIONS: {
    TYPE: 'TenantApplications',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC
    }
  },
  TENANT_CLIENTS: {
    TYPE: 'TenantClients',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC
    }
  },
  TENANT_DATASOURCES: {
    TYPE: 'TenantDatasources',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC
    }
  },
  AI_TRANSLATION_SERVICES: {
    TYPE: 'AiTranslationServices',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC
    }
  },
  AI_TRANSLATION_MODELS: {
    TYPE: 'AiTranslationModels',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC
    }
  },
  AI_TRANSLATION_MODEL_EXAMPLES: {
    TYPE: 'AiTranslationModelExamples',
    SORT:
    {
      field: 'source',
      direction: SORT_DIRECTION.ASC
    }
  },
};
