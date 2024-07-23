/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const offset = { x: -170, y: 0 }

export const EXPORT_TYPE = {
  XLSX: 'XLSX',
  JSON: 'JSON'
};

export const MASKED_STRING = '***MASKED***';

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc'
};

export const DEFAULT_TABLE = {
  PAGE: {
    ITEMS_PER_PAGE: 10,
    ITEMS_PER_PAGE_OPTIONS: [10, 20, 50, 100]
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
  AI_SERVICES: {
    TYPE: 'AiServices',
    SORT:
    {
      field: 'id',
      direction: SORT_DIRECTION.DESC,
    },
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
      field: 'key',
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
  UNSPSC_SEGMENTS:{
    TYPE: 'UNSPSCSegments',
    SORT:
    {
      field: 'id',
      direction: SORT_DIRECTION.DESC
    }
  },
  CLASSIFICATION_CATALOGS:{
    TYPE: 'ClassificationCatalogs',
    SORT:
    {
      field: 'id',
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
  TEST_CASE_CONFIGURATIONS:{
    TYPE: 'TestCaseConfigurations',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC
    }
  },
  TEST_CASES:{
    TYPE: 'TestCases',
    SORT:
    {
      field: 'name',
      direction: SORT_DIRECTION.DESC
    }
  },
  TEST_CASE_EXECUTIONS:{
    TYPE: 'TestCaseExecutions',
    SORT:
    {
      field: 'id',
      direction: SORT_DIRECTION.DESC
    }
  },
};
