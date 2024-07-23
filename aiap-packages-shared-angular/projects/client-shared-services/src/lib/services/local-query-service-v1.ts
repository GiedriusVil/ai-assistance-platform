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
  _warnX
} from 'client-shared-utils';


import { EventsServiceV1 } from './events-service-v1';
import { BaseServiceV1 } from './base-service-v1';
import { EnvironmentServiceV1 } from './environment-service-v1';
import { SessionServiceV1 } from './session-service-v1';

const LOCAL_STORAGE_KEY = {
  QUERY: 'query',
};

@Injectable()
export class LocalQueryServiceV1 extends BaseServiceV1 {

  static getClassName() {
    return 'LocalQueryService';
  }

  static FILTER_KEY = {
    ASSISTANT_IDS: 'assistantIds',
    CONVERSATION_ID: 'conversationId',
    IS_ZERO_DURATION_VISIBLE: 'isZeroDurationVisible',
    IS_SYSTEM_MESSAGES_VISIBLE: 'isSystemMessagesVisible',
    IS_NO_USER_INTERACTION_VISIBLE: 'isNoUserInteractionVisible',
    IS_REVIEWED_VISIBLE: 'isReviewedVisible',
    DATE_RANGE: 'dateRange',
    UTTERANCE: 'utterance',
    INTENT: 'intent',
    SCORE: 'score',
    ACTION_NEEDED: 'actionNeeded',
    FALSE_POSITIVE_INTENTS: 'falsePositiveIntents',
    SKILL_ID: 'skillId',
    TEST_NAME: 'testName',
    SEARCH: 'search',
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    protected eventsService: EventsServiceV1,
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
      _warnX(LocalQueryServiceV1.getClassName(), 'setFilterItem', { key, item });
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

  public deleteFilterItems(type: string, ...keys: string[]) {
    const QUERY = this._retrieveQuery(type);
    for (const KEY of keys) {
      try {
        delete QUERY.filter[KEY];
      } catch (error) {
        _errorX(LocalQueryServiceV1.getClassName(), 'deleteFilterItems',
          {
            error: {
              text: `${error}`,
              json: error,
            }
          });
      }
    }
    this._saveQuery(type, QUERY);
  }

  public setSort(type: string, sort: any) {
    const QUERY = this._retrieveQuery(type);
    const SORT_PARAMS = ramda.path(['sort'], QUERY);
    if (lodash.isEmpty(SORT_PARAMS)) {
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

  public handlePageChangeEvent(type: string, model: any, page: any, isModal = false) {
    const QUERY = this._retrieveQuery(type);
    QUERY.pagination.page = page;
    QUERY.pagination.size = model.pageLength;
    this._saveQuery(type, QUERY);
  }

  public handleSortByHeader(type: string, model: any, index: any, isModal = false) {
    const SORT_HEADER = ramda.path(['header', index], model);
    const QUERY = this._retrieveQuery(type);
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
    }
    const HEADERS = ramda.path(['header'], model);
    for (const HEADER of HEADERS) {
      if (
        HEADER &&
        SORT_HEADER &&
        HEADER.data !== SORT_HEADER.data
      ) {
        HEADER.sorted = false;
      }
    }
    this._saveQuery(type, QUERY);
  }

  private _saveQuery(type: string, query: any) {
    const QUERY_TO_SAVE = {
      [type]: query
    }
    this._setQueryToLocalStorage(QUERY_TO_SAVE);
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
    let retVal = this._getQueryFromLocalStorageByType(type);
    if (
      lodash.isEmpty(retVal)
    ) {
      retVal = this._defaultQuery(type);
    }
    return retVal;
  }

  private _setQueryToLocalStorage(query: any) {
    const QUERY_FOR_STORAGE = this._constructLocalStorageQuery(query);
    const QUERY_SERIALIZED = this._serialize(QUERY_FOR_STORAGE);
    const QUERY_KEY = this._getQueryKeyName();
    localStorage.setItem(QUERY_KEY, QUERY_SERIALIZED);
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
    const QUERY_AS_STRING = localStorage.getItem(QUERY_KEY);
    const RET_VAL = this._deserialize(QUERY_AS_STRING);
    _debugX(LocalQueryServiceV1.getClassName(), `_getQueryFromLocalStorage`,
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
      _errorX(LocalQueryServiceV1.getClassName(), `_serialized`,
        {
          type: 'SERIALIZE_ERROR',
          error: {
            text: `${error}`,
            json: error
          },
        });
    }
  }

  private _deserialize(jsonString: string) {
    try {
      const RET_VAL = JSON.parse(jsonString);
      this._ensureDateRangeDateTypes(RET_VAL);
      return RET_VAL;
    } catch (error) {
      _errorX(LocalQueryServiceV1.getClassName(), `_deserialize`,
        {
          type: 'DESERIALIZE_ERROR',
          error: {
            text: `${error}`,
            json: error
          },
        });
    }
  }

  private _ensureDateRangeDateTypes(query: any) {
    Object.keys(query).forEach(params => {
      const DATE_FROM_AS_STRING = ramda.path([params, 'filter', 'dateRange', 'from'], query);
      const DATE_TO_AS_STRING = ramda.path([params, 'filter', 'dateRange', 'to'], query);
      if (
        !lodash.isEmpty(DATE_FROM_AS_STRING) || !lodash.isEmpty(DATE_TO_AS_STRING)
      ) {
        query[params].filter.dateRange.from = this._convertDateStringToDateType(DATE_FROM_AS_STRING);
        query[params].filter.dateRange.to = this._convertDateStringToDateType(DATE_TO_AS_STRING);
      }
    })
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
        _errorX(LocalQueryServiceV1.getClassName(), `_converDateStringToDateType`,
          {
            type: 'CONVERT_DATE_STRING_TO_DATE_TYPE_ERROR',
            error: {
              text: `${error}`,
              json: error,
            },
          });
      }
    }
  }

}
