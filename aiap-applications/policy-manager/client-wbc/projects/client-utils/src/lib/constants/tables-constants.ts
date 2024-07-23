/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc'
};

export const DEFAULT_TABLE = {
  PAGE: {
    ITEMS_PER_PAGE: 10,
    ITEMS_PER_PAGE_OPTIONS: [10, 20, 50, 100]
  },
  DOC_VALIDATIONS_METRICS_V1: {
    TYPE: 'DOC_VALIDATIONS_METRICS_V1'
  },
  DOC_VALIDATIONS_METRICS_V2: {
    TYPE: 'DOC_VALIDATIONS_METRICS_V2'
  },
  DOC_VALIDATIONS_V1: {
    TYPE: 'DOC_VALIDATIONS_V1',
    SORT: {
      field: 'created.date',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  DOC_VALIDATIONS_V2: {
    TYPE: 'DOC_VALIDATIONS_V2',
    SORT: {
      field: 'created.date',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  ORGANIZATIONS_V1: {
    TYPE: 'Organizations',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  ORGANIZATIONS_CHANGES_V1: {
    TYPE: 'OrganizationsChanges',
    SORT: {
      field: 'timestamp',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  RULE_ACTIONS_CHANGES_V1: {
    TYPE: 'RULE_ACTIONS_CHANGES',
    SORT: {
      field: 'created.date',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  RULE_ACTIONS_V1: {
    TYPE: 'Actions',
    SORT: {
      field: 'key',
      direction: SORT_DIRECTION.ASC
    },
    FIELDS: {}
  },
  RULE_MESSAGES_V1: {
    TYPE: 'Messages',
    SORT: {
      field: 'name',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  RULE_MESSAGES_CHANGES_V1: {
    TYPE: 'MessagesChanges',
    SORT: {
      field: 'context',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  RULES_V1: {
    TYPE: 'Rules',
    SORT: {
      field: 'name',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  RULES_V2: {
    TYPE: 'RULES_V2',
    SORT: {
      field: 'updated.date',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  RULES_CONDITIONS_V2: {
    TYPE: 'RULES_CONDITIONS_V2',
    SORT: {
      field: 'path',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  RULES_CHANGES_V1: {
    TYPE: 'RulesChanges',
    SORT: {
      field: 'timestamp',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  RULES_CHANGES_V2: {
    TYPE: 'RULES_CHANGES_V2',
    SORT: {
      field: 'created.date',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  VALIDATION_ENGAGEMENTS_V1: {
    TYPE: 'VALIDATION_ENGAGEMENTS_V1',
    SORT: {
      field: 'updated.date',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  },
  VALIDATION_ENGAGEMENTS_CHANGES_V1: {
    TYPE: 'VALIDATION_ENGAGEMENTS_CHANGES_V1',
    SORT: {
      field: 'created.date',
      direction: SORT_DIRECTION.DESC,
    },
    FIELD: {}
  }
};
