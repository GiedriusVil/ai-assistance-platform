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
  TOPIC_MODELING: {
    TYPE: 'TopicModeling',
    SORT:
    {
      field: 'started',
      direction: SORT_DIRECTION.DESC
    }
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
  },
  CONVERSATIONS: {
    TYPE: 'Conversations',
    SORT:
    {
      field: 'start',
      direction: SORT_DIRECTION.DESC,
    },
  },
  UTTERANCES: {
    TYPE: 'Utterances',
    SORT:
    {
      field: 'timestamp',
      direction: SORT_DIRECTION.DESC,
    },
  },
  SURVEYS: {
    TYPE: 'Surveys',
    SORT:
    {
      field: 'timestamp',
      direction: SORT_DIRECTION.DESC,
    },
  }
};
