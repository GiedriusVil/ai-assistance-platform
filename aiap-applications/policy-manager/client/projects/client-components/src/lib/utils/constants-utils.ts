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

export const ARRAY_OPERATORS = [
  'notIn',
  'in'
]

// TODO move it to table.utils.ts
export const DEFAULT_TABLE = {
  PAGE: {
    ITEMS_PER_PAGE: 10,
    ITEMS_PER_PAGE_OPTIONS: [10, 20, 50, 100]
  },
  USERS: {
    SORT: {
      FIELD: 'username',
      DIRECTION: SORT_DIRECTION.ASC,
      SORT_INDEX: 0
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
  UTTERANCES: {
    SORT: {
      FIELD: 'timestamp',
      DIRECTION: SORT_DIRECTION.ASC,
      SORT_INDEX: 0
    },
  },
  ACCESS_GROUPS: {
    SORT: {
      FIELD: 'name',
      DIRECTION: SORT_DIRECTION.ASC,
      SORT_INDEX: 0
    },
    FIELD: {}

  },
  TENANTS: {
    SORT: {
      SORT_INDEX: 0
    },
    FIELD: {}
  }
};
