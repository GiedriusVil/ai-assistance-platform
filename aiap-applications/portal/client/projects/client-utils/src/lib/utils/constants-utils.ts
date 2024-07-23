/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
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
      TIMEZONE: 'America/Danmarkshavn',
      TENANTS: [],
    }
  },
  USERS_CHANGES: {
    TYPE: 'UsersChanges',
    SORT: {
      field: 'created.date',
      direction: SORT_DIRECTION.ASC,
    },
    FIELD: {}
  },
  AUDITS: {
    TYPE: 'Audits',
    SORT: {
      FIELD: 'initiator',
      DIRECTION: SORT_DIRECTION.ASC,
      SORT_INDEX: 0
    },
    FIELD: {}
  },
  ASSISTANTS_CHANGES: {
    TYPE: 'AssistantsChanges',
    SORT: {
      field: 'created.date',
      direction: SORT_DIRECTION.ASC,
    },
    FIELD: {}
  },
  ACCESS_GROUPS: {
    TYPE: 'AccessGroups',
    SORT: {
      field: 'name',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  ACCESS_GROUPS_CHANGES: {
    TYPE: 'AccessGroupsChanges',
    SORT: {
      field: 'created.date',
      direction: SORT_DIRECTION.ASC,
    },
    FIELD: {}
  },
  TENANTS: {
    TYPE: 'Tenants',
    SORT: {
      field: 'name',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  TENANTS_CHANGES: {
    TYPE: 'TenantsChanges',
    SORT: {
      field: 'created.date',
      direction: SORT_DIRECTION.ASC,
    },
    FIELD: {}
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
      field: 'initiator',
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
  APPLICATIONS: {
    TYPE: 'Applications',
    SORT: {
      field: 'name',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  APPLICATIONS_CHANGES: {
    TYPE: 'ApplicationsChanges',
    SORT: {
      field: 'created.date',
      direction: SORT_DIRECTION.ASC,
    },
  },
  ASSISTANTS: {
    TYPE: 'Assistants',
    SORT: {
      field: 'name',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
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
  TENANT_ASSISTANTS: {
    TYPE: 'TenantAssistants',
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
  RULES: {
    TYPE: 'Rules',
    SORT: {
      field: 'initiator',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  RULES_CHANGES: {
    TYPE: 'RulesChanges',
    SORT: {
      field: 'initiator',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  TRANSACTIONS: {
    TYPE: 'Transactions',
    SORT: {
      field: 'initiator',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  ORGANIZATIONS: {
    TYPE: 'Organizations',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  MESSAGES: {
    TYPE: 'Messages',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  MESSAGES_CHANGES: {
    TYPE: 'MessagesChanges',
    SORT: {
      field: 'initiator',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  METRICS_SUMMARY: {
    TYPE: 'MetricsSummary',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  LIVE_METRICS: {
    TYPE: 'LiveMetrics',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  DOC_VALIDATION_TRANSACTIONS: {
    TYPE: 'DOC_VALIDATION_TRANSACTIONS',
    SORT: {
      field: 'created.date',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
}

