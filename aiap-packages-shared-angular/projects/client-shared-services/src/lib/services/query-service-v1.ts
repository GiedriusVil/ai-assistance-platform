/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// import * as lzwcompress from 'lzwcompress'; Lets keep this library for reference
import * as ramda from 'ramda';
import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
  _warnX,
} from 'client-shared-utils';

import { SessionServiceV1 } from './session-service-v1';
import { EventsServiceV1 } from './events-service-v1';
import { BaseServiceV1 } from './base-service-v1';
import { EnvironmentServiceV1 } from './environment-service-v1';
import { LocalStorageServiceV1 } from './local-storage-service-v1';

const LOCAL_STORAGE_KEY = {
  QUERY: 'query',
};

@Injectable({
  providedIn: 'root',
})
export class QueryServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'QueryServiceV1';
  }

  static FILTER_KEY = {
    ASSISTANT_IDS: 'assistantIds',
    CONVERSATION_ID: 'conversationId',
    IS_ZERO_DURATION_VISIBLE: 'isZeroDurationVisible',
    IS_SYSTEM_MESSAGES_VISIBLE: 'isSystemMessagesVisible',
    IS_NO_USER_INTERACTION_VISIBLE: 'isNoUserInteractionVisible',
    IS_REVIEWED_VISIBLE: 'isReviewedVisible',
    DATE_RANGE: 'dateRange',
    DASHBOARD_ID: 'dashboard',
    UTTERANCE: 'utterance',
    INTENT: 'intent',
    SCORE: 'score',
    ACTION_NEEDED: 'actionNeeded',
    FALSE_POSITIVE_INTENTS: 'falsePositiveIntents',
    SKILL_ID: 'skillId',
    TEST_ID: 'testId',
    TEST_NAME: 'testName',
    SEARCH: 'search',
    OVERALL_METRICS: 'overallMetrics',
    ORGANIZATION_IDS: 'organizationIds',
    IS_ORGANIZATIONS_WITH_WARNING: 'isOrganizationsWithWarning',
    IS_RULES_WITH_WARNING: 'isRulesWithWarning',
    RULES_WITHOUT_MESSAGE: 'rulesWithoutMessage',
    DOC_TYPE: 'docType',
    ACTION: 'action',
    RULE_TYPE: 'ruleType',
    ORGANIZATION: 'organization',
    BUYER_IDS: 'buyerIds',
    CHANNELS: 'channels',
    TOTAL_MESSAGES: 'totalMessages',
    USER_ENTRIES: 'userEntries',
    AVG_CONFIDENCE: 'avgConfidence',
    RULE_STATUS: 'ruleStatus',
  };

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    protected eventsService: EventsServiceV1,
    protected localStorageService: LocalStorageServiceV1,
    protected location: Location,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
  ) {
    super(environmentService, sessionService);
  }

  public query(type: string) {
    const RET_VAL = this._retrieveQuery(type);
    return RET_VAL;
  }

  public pagination(type: string) {
    const QUERY = this._retrieveQuery(type);
    let retVal = QUERY?.pagination;
    if (
      lodash.isEmpty(retVal)
    ) {
      retVal = {
        page: 1,
        size: 10,
      };
    }
    return retVal;
  }

  public filterDateRange(type: string) {
    const QUERY = this._retrieveQuery(type);
    const RET_VAL = QUERY?.filter?.dateRange;
    return RET_VAL;
  }

  public setFilterItem(type: string, key: string, item: any) {
    const QUERY = this._retrieveQuery(type);
    if (
      !lodash.isEmpty(key)
    ) {
      QUERY.filter[key] = item;
    } else {
      _warnX(QueryServiceV1.getClassName(), 'setFilterItem',
        {
          key,
          item,
        });
    }
    QUERY.pagination.page = 1;
    this._saveQuery(type, QUERY);
  }

  public setFilterItems(type: string, filter: any) {
    const QUERY = this._retrieveQuery(type);
    if (!lodash.isEmpty(filter)) {
      QUERY.filter = ramda.mergeDeepRight(QUERY.filter, filter);
    }
    QUERY.pagination.page = 1;
    this._saveQuery(type, QUERY);
  }

  public refreshState(type: string) {
    const QUERY = this._retrieveQuery(type);
    this._saveQuery(type, QUERY);
  }

  public getFilterItem(type: string, key: string) {
    const QUERY = this._retrieveQuery(type);
    const RET_VAL = ramda.path(['filter', key], QUERY);
    return RET_VAL;
  }

  public getSearchValue(type: string) {
    _debugX(QueryServiceV1.getClassName(), `getSearchValue `,
      {
        type,
      });

    const QUERY = this._retrieveQuery(type);
    const RET_VAL = ramda.pathOr('', ['filter', 'search'], QUERY);
    return RET_VAL;
  }

  public deleteFilterItems(type: string, ...keys: string[]) {
    const QUERY = this._retrieveQuery(type);
    for (const KEY of keys) {
      try {
        delete QUERY.filter[KEY];
      } catch (error) {
        _errorX(QueryServiceV1.getClassName(), 'deleteFilterItems',
          {
            error: {
              text: `${error}`,
              json: error
            }
          });
      }
    }
    this._saveQuery(type, QUERY);
  }

  public getSortItem(type: string) {
    const QUERY = this._retrieveQuery(type);
    const RET_VAL = QUERY?.sort;
    return RET_VAL;
  }

  public setSort(type: string, sort: any) {
    const QUERY = this._retrieveQuery(type);
    const SORT_PARAMS = QUERY?.sort;
    if (lodash.isNil(SORT_PARAMS)) {
      QUERY.sort = sort;
    }
    this._saveQuery(type, QUERY);
  }

  public setOptions(type: string, options: any) {
    const QUERY = this._retrieveQuery(type);
    QUERY.options = options;
    this._saveQuery(type, QUERY);
  }

  public setPagination(type: string, pagination: any) {
    const QUERY = this._retrieveQuery(type);
    QUERY.pagination = pagination;
    this._saveQuery(type, QUERY);
  }

  // public handlePageChangeEvent(type: string, model: any, page: any, isModal: boolean = false) {
  //   const QUERY = this._retrieveQuery(type);
  //   QUERY.pagination.page = page;
  //   QUERY.pagination.size = model.pageLength;
  //   this._saveQuery(type, QUERY);
  //   if (isModal) {
  //     this.eventsService.modalFilterEmit(QUERY);
  //   } else {
  //     this.eventsService.filterEmit(QUERY);
  //   }
  // }

  public handlePageChangeEvent(type: string, model: any, page: any, stuff: (any) => any = undefined, isModal = false) {
    const QUERY = this._retrieveQuery(type);
    QUERY.pagination.page = page;
    QUERY.pagination.size = model.pageLength;
    this._saveQuery(type, QUERY);
    if (isModal) {
      this.eventsService.modalFilterEmit(QUERY);
    } else {
      if (stuff) {
        stuff(QUERY)
      } else {
        this.eventsService.filterEmit(QUERY);
      }
    }
  }

  // public handleSortByHeader(type: string, model: any, index: any, isModal: boolean = false) {
  //   const SORT_HEADER = ramda.path(['header', index], model);
  //   const QUERY = this._retrieveQuery(type);
  //   _debugX(QueryServiceV1.getClassName(), `handleSortByHeader `, { type, model, index, isModal, SORT_HEADER, QUERY });
  //   if (
  //     !SORT_HEADER.sorted
  //   ) {
  //     SORT_HEADER.sorted = true;
  //     SORT_HEADER.ascending = true;
  //     QUERY.sort = {
  //       field: SORT_HEADER.field,
  //       direction: 'asc'
  //     }
  //   } else if (
  //     SORT_HEADER.sorted &&
  //     SORT_HEADER.ascending
  //   ) {
  //     SORT_HEADER.ascending = false;
  //     QUERY.sort = {
  //       field: SORT_HEADER.field,
  //       direction: 'desc'
  //     }
  //   } else {
  //     SORT_HEADER.sorted = false;
  //     QUERY.sort = {};
  //   }
  //   const HEADERS = ramda.path(['header'], model);
  //   for (let header of HEADERS) {
  //     if (
  //       header &&
  //       SORT_HEADER &&
  //       !lodash.isEqual(header.data, SORT_HEADER.data)
  //     ) {
  //       header.sorted = false;
  //     }
  //   }
  //   this._saveQuery(type, QUERY);
  //   if (isModal) {
  //     this.eventsService.modalFilterEmit(QUERY);
  //   } else {
  //     this.eventsService.filterEmit(QUERY);
  //   }
  // }

  public handleSortByHeader(type: string, model: any, index: any, stuff = undefined, isModal = false) {
    const SORT_HEADER = ramda.path(['header', index], model);
    const QUERY = this._retrieveQuery(type);
    _debugX(QueryServiceV1.getClassName(), `handleSortByHeader `,
      {
        type,
        model,
        index,
        isModal,
        SORT_HEADER,
        QUERY,
      });

    if (
      !SORT_HEADER.sorted
    ) {
      SORT_HEADER.sorted = true;
      SORT_HEADER.ascending = true;
      QUERY.sort = {
        field: SORT_HEADER.field,
        direction: 'asc'
      }
    } else if (
      SORT_HEADER.sorted &&
      SORT_HEADER.ascending
    ) {
      SORT_HEADER.ascending = false;
      QUERY.sort = {
        field: SORT_HEADER.field,
        direction: 'desc'
      }
    } else {
      SORT_HEADER.sorted = false;
      QUERY.sort = {};
    }
    const HEADERS = ramda.path(['header'], model);
    for (const HEADER of HEADERS) {
      if (
        HEADER &&
        SORT_HEADER &&
        !lodash.isEqual(HEADER.data, SORT_HEADER.data)
      ) {
        HEADER.sorted = false;
      }
    }
    this._saveQuery(type, QUERY);
    if (isModal) {
      this.eventsService.modalFilterEmit(QUERY);
    } else {
      if (stuff) {
        stuff(QUERY);
      } else {
        this.eventsService.filterEmit(QUERY);
      }
    }
  }

  private _cleanPathFromQuery(path: string) {
    let retVal;
    if (path.includes('?')) {
      retVal = path.split('?')[0];
    } else {
      retVal = path;
    }
    return retVal;
  }

  private _saveQuery(type: string, query: any) {
    _debugX(QueryServiceV1.getClassName(), `_saveQuery `,
      {
        type,
        query,
      });
    const QUERY_TO_SAVE = {
      [type]: query
    }
    this._setQueryToLocalStorage(QUERY_TO_SAVE);
    this._setQueryToUrl(QUERY_TO_SAVE);
  }

  private _defaultQuery(type: string) {
    const TO_DATE = new Date();
    const FROM_DATE = new Date();

    FROM_DATE.setTime(TO_DATE.getTime());
    FROM_DATE.setDate(TO_DATE.getDate() - 1)

    const RET_VAL: any = {
      filter: {
        dateRange: {
          from: FROM_DATE,
          to: TO_DATE,
          mode: 'day',
        },
        conversationId: '',
        utterance: '',
        search: '',
        skillId: '',
      },
      pagination: {
        page: 1,
        size: 10,
      },
      options: {
        utterances: true,
        utterancesTotals: true,
        intents: true
      },
      type: type,
    };
    return RET_VAL;
  }

  private _retrieveQuery(type: string) {
    let retVal = this._getQueryFromUrlByType(type);
    if (
      lodash.isEmpty(retVal)
    ) {
      retVal = this._getQueryFromLocalStorageByType(type);
    }
    if (
      lodash.isEmpty(retVal)
    ) {
      retVal = this._defaultQuery(type);
    }
    return retVal;
  }

  private _setQueryToUrl(query: any) {
    const QUERY_ENCODED = this._encode(query);
    const STATE = this.location.getState();
    const PATH = this.location.path(false);
    const PATH_CLEAN = this._cleanPathFromQuery(PATH);
    const ACTIVATED_ROUTE_SNAPSHOT = this.activatedRoute.snapshot;
    let httpQueryParams = ACTIVATED_ROUTE_SNAPSHOT.queryParams;


    if (
      lodash.isEmpty(httpQueryParams) &&
      !lodash.isEmpty(PATH)
    ) {
      httpQueryParams = {};

      const PARAMS_FROM_LOCATION = PATH.split('?')[1];
      if (!lodash.isEmpty(PARAMS_FROM_LOCATION)) {
        const PARAMS = PARAMS_FROM_LOCATION.split('&');
        PARAMS.forEach(param => {
          const [key, value] = param.split('=');
          httpQueryParams[key] = value;
        });
      }
    }

    let httpQueryAsString = '';
    for (const KEY of Object.keys(httpQueryParams)) {
      if (
        KEY !== 'query'
      ) {
        const HTTP_QUERY_PARAM_VALUE = httpQueryParams[KEY];
        httpQueryAsString = `${httpQueryAsString}&${KEY}=${HTTP_QUERY_PARAM_VALUE}`;
      }
    }
    httpQueryAsString = `${httpQueryAsString}&query=${QUERY_ENCODED}`;
    httpQueryAsString = httpQueryAsString.substr(1, httpQueryAsString.length - 1);
    this.location.replaceState(PATH_CLEAN, httpQueryAsString, STATE);
  }

  private _getQueryFromUrlByType(type: string) {
    const QUERY = this._getQueryFromUrl();
    let retVal;
    if (!lodash.isEmpty(QUERY)) {
      const TYPE_QUERY = ramda.path([type], QUERY);
      if (!lodash.isEmpty(TYPE_QUERY)) {
        retVal = TYPE_QUERY;
      }
    }
    return retVal;
  }

  private _getQueryFromUrl() {
    // const ACTIVATED_ROUTE_SNAPSHOT = this.activatedRoute.snapshot;
    // const HTTP_QUERY_PARAMS = ACTIVATED_ROUTE_SNAPSHOT.queryParams;
    // const QUERY_BASE64 = HTTP_QUERY_PARAMS?.query;
    const HTTP_PATH = this.location.path(false);
    const URL_TREE = this.router.parseUrl(HTTP_PATH);
    const QUERY_ENCODED = URL_TREE?.queryParams?.query;
    const RET_VAL = this._decode(QUERY_ENCODED);
    _debugX(QueryServiceV1.getClassName(), `_getQueryFromUrl `,
      {
        RET_VAL,
        QUERY_ENCODED,
      });
    return RET_VAL;
  }

  private _setQueryToLocalStorage(query: any) {
    const QUERY_FOR_STORAGE = this._constructLocalStorageQuery(query);
    const QUERY_KEY = this._getQueryKeyName();
    this.localStorageService.set(QUERY_KEY, QUERY_FOR_STORAGE);
  }

  private _getQueryKeyName() {
    const USERNAME = ramda.path(['username'], this.sessionService.getUser());
    const RET_VAL = LOCAL_STORAGE_KEY.QUERY + '_' + USERNAME;
    return RET_VAL;
  }

  private _constructLocalStorageQuery(query: any) {
    let retVal = {};
    const TYPE = ramda.keys(query)[0];
    const CURRENT_LOCALSTORAGE_QUERY = this._getQueryFromLocalStorage();

    if (lodash.isEmpty(CURRENT_LOCALSTORAGE_QUERY)) {
      retVal = lodash.merge(retVal, query);
    } else {
      const FOUND_QUERY_BY_TYPE = ramda.path([TYPE], CURRENT_LOCALSTORAGE_QUERY);
      if (!FOUND_QUERY_BY_TYPE) {
        retVal = lodash.merge(CURRENT_LOCALSTORAGE_QUERY, query);
      } else {
        CURRENT_LOCALSTORAGE_QUERY[TYPE] = query[TYPE];
        retVal = CURRENT_LOCALSTORAGE_QUERY;
      }
    }
    return retVal;
  }

  private _getQueryFromLocalStorageByType(type: string) {
    const QUERY = this._getQueryFromLocalStorage();
    let retVal;
    if (!lodash.isEmpty(QUERY)) {
      const TYPE_QUERY = ramda.path([type], QUERY);
      if (!lodash.isEmpty(TYPE_QUERY)) {
        retVal = TYPE_QUERY;
      }
    }
    return retVal;
  }

  private _getQueryFromLocalStorage() {
    const QUERY_KEY = this._getQueryKeyName();
    const RET_VAL = this.localStorageService.get(QUERY_KEY);
    this._ensureDateRangeDateTypes(RET_VAL);
    _debugX(QueryServiceV1.getClassName(), `_getQueryFromLocalStorage`,
      {
        RET_VAL,
      });

    return RET_VAL;
  }

  private _serialize(object: any) {
    try {
      let retVal;
      if (
        object
      ) {
        retVal = JSON.stringify(object);
      }
      return retVal;
    } catch (error) {
      _errorX(QueryServiceV1.getClassName(), `_serialized`,
        {
          type: 'SERIALIZE_ERROR',
          error: {
            text: `${error}`,
            json: error
          }
        });
    }
  }

  private _encode(value: any) {
    let retVal;
    try {
      if (
        value
      ) {
        retVal = btoa(this._serialize(value));
      }
      // retVal = lzwCompressor.encode(this._serialize(value));
      // retVal = lzwcompress.pack(value);
    } catch (error) {
      _errorX(QueryServiceV1.getClassName(), `_encode`,
        {
          type: 'ENCODE_ERROR',
          error: {
            text: `${error}`,
            json: error
          }
        });
    }
    return retVal;
  }

  private _decode(value: any) {
    let retVal;
    try {
      if (
        value
      ) {
        retVal = this._deserialize(atob(value));
      }
      // retVal = lzwcompress.unpack(value);
    } catch (error) {
      _errorX(QueryServiceV1.getClassName(), `_decode`,
        {
          type: 'DECODE_ERROR',
          error: {
            text: `${error}`,
            json: error
          }
        });
    }
    return retVal;
  }

  private _deserialize(jsonString: string) {
    try {
      const RET_VAL = JSON.parse(jsonString);
      this._ensureDateRangeDateTypes(RET_VAL);
      return RET_VAL;
    } catch (error) {
      _errorX(QueryServiceV1.getClassName(), `_deserialize`,
        {
          type: 'DESERIALIZE_ERROR',
          error: {
            text: `${error}`,
            json: error
          }
        });
    }
  }

  private _ensureDateRangeDateTypes(query: any) {
    if (lodash.isObject(query)) {
      Object.keys(query).forEach(params => {
        const DATE_FROM_AS_STRING = ramda.path([params, 'filter', 'dateRange', 'from'], query);
        const DATE_TO_AS_STRING = ramda.path([params, 'filter', 'dateRange', 'to'], query);
        if (
          !lodash.isEmpty(DATE_FROM_AS_STRING) || !lodash.isEmpty(DATE_TO_AS_STRING)
        ) {
          query[params].filter.dateRange.from = this._convertDateStringToDateType(DATE_FROM_AS_STRING);
          query[params].filter.dateRange.to = this._convertDateStringToDateType(DATE_TO_AS_STRING);
        }
      });
    }
  }

  private _convertDateStringToDateType(date: any) {
    if (
      lodash.isString(date) &&
      !lodash.isEmpty(date)
    ) {
      try {
        const RET_VAL = new Date(date);
        return RET_VAL;
      } catch (error) {
        _errorX(QueryServiceV1.getClassName(), `_converDateStringToDateType`,
          {
            type: 'CONVERT_DATE_STRING_TO_DATE_TYPE_ERROR',
            error: {
              text: `${error}`,
              json: error
            }
          });
      }
    }
  }

}
