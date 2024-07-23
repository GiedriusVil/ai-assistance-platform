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
export const VALUE_NA = 'N/A';

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
      direction: SORT_DIRECTION.DESC,
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
  APPLICATIONS: {
    TYPE: 'Applications',
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
  TRANSACTIONS: {
    TYPE: 'Transactions',
    SORT: {
      field: 'context',
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
  BUY_RULES: {
    TYPE: 'Buy Rules',
    SORT: {
      field: 'effectiveDate',
      direction: SORT_DIRECTION.ASC
    },
    FIELD: {}
  },
  BUY_RULES_SUPPLIERS: {
    TYPE: 'Suppliers',
    SORT: {
      field: 'supplier.id',
      direction: SORT_DIRECTION.ASC
    },
    FIELDS: {}
  },
  BUY_RULES_CONDITIONS: {
    TYPE: 'Conditions',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.ASC
    },
    FIELDS: {}
  },
  CATALOG_RULES: {
    TYPE: 'Catalog Rules',
    SORT: {
      field: 'effectiveDate',
      directions: SORT_DIRECTION.ASC,
    }
  },
  CATALOG_RULE_CONDITIONS: {
    TYPE: 'CATALOG_RULE_CONDITIONS',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.ASC
    },
    FIELDS: {}
  },
  CATALOG_RULE_CATALOGS: {
    TYPE: 'CATALOG_RULE_CATALOGS',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.ASC
    },
    FIELDS: {}
  },
  CLASSIFICATION_RULES: {
    TYPE: 'Classification Rules',
    SORT: {
      field: 'effective',
      directions: SORT_DIRECTION.ASC,
    }
  },
  CLASSIFICATION_RULE_CONDITIONS: {
    TYPE: 'Classification Conditions',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.ASC
    },
    FIELDS: {}
  },
  CLASSIFICATION_RULE_CLASSIFICATIONS: {
    TYPE: 'Classification classifications',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.ASC
    },
    FIELDS: {}
  },
  BUY_RULE_CHANGES: {
    TYPE: 'BUY_RULE_CHANGES',
    SORT: {
      field: 'updated.date',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  CLASSIFICATION_RULE_CHANGES: {
    TYPE: 'CLASSIFICATION_RULE_CHANGES',
    SORT: {
      field: 'updated.date',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  CATALOG_RULE_CHANGES: {
    TYPE: 'CATALOG_RULE_CHANGES',
    SORT: {
      field: 'updated.date',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
}

export const QUERIES = {
  BUY_RULES_CONDITION_FACTS: {
    TYPE: 'BuyRuleConditionFacts'
  },
  BUY_RULES_CONDITION_OPERATORS: {
    TYPE: 'BuyRuleConditionOperators'
  },
  CLASSIFIACTION_RULES_CONDITION_FACTS: {
    TYPE: 'ClassificationRuleConditionFacts'
  },
  CLASSIFIACTION_RULES_CONDITION_OPERATORS: {
    TYPE: 'ClassificationRuleConditionOperators'
  },
  CATALOG_RULES_CONDITION_FACTS: {
    TYPE: 'CatalogRuleConditionFacts'
  },
  CATALOG_RULES_CONDITION_OPERATORS: {
    TYPE: 'CatalogRuleConditionOperators'
  },
}

export const EXTERNAL_QUERIES = {
  BUY_RULES_SUPPLIERS: {
    TYPE: 'ExternalSuppliers',
  },
  CATALOG_RULES_CATALOGS: {
    TYPE: 'ExternalCatalogs',
  },
  CLASSIFICATION_RULES_SEGMENT: {
    TYPE: 'ExternalClassificationSegment',
  },
  CLASSIFICATION_RULES_FAMILY: {
    TYPE: 'ExternalClassificationFamily',
  },
  CLASSIFICATION_RULES_CLASSES: {
    TYPE: 'ExternalClassificationClass',
  },
  CLASSIFICATION_RULES_COMMODITY: {
    TYPE: 'ExternalClassificationCommodity',
  },
}
