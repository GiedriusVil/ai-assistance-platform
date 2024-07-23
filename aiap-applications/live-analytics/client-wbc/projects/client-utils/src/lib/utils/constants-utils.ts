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
  LIVE_ANALYTICS: {
    TYPE: 'LiveAnalytics',
  },
  LIVE_ANALYTICS_CONFIGURATIONS: {
    TYPE: 'LiveAnalyticsChanges',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.ASC
    }
  },
  FILTERS_MODELS_CHANGES_V1: {
    TYPE: 'FilterModelsChangesV1',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.ASC
    }
  },
  DASHBOARDS_MODELS_CHANGES_V1: {
    TYPE: 'FilterModelsChangesV1',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.ASC
    }
  },
  TILES_MODELS_CHANGES_V1: {
    TYPE: 'FilterModelsChangesV1',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.ASC
    }
  },
  QUERIES_MODELS_CHANGES_V1: {
    TYPE: 'FilterModelsChangesV1',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.ASC
    }
  },
  CHARTS_MODELS_CHANGES_V1: {
    TYPE: 'FilterModelsChangesV1',
    SORT: {
      field: 'id',
      direction: SORT_DIRECTION.ASC
    }
  }
};


export const OUTLETS = {
  liveAnalytics: 'liveAnalytics'
}
