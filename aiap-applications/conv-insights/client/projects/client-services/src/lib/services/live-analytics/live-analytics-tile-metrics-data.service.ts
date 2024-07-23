/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, of, Observable } from 'rxjs';

import {
  _debugX,
  _errorX,
  ENUM_LIVE_TILE_METRIC_ID,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable({
  providedIn: 'root'
})
export class LiveAnalyticsTileMetricsDataService extends BaseServiceV1 {

  static getClassName() {
    return 'LiveAnalyticsTileMetricsDataService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  retrieveTileMetricData(params: any) {
    let tileMetricId;
    let retVal;
    try {
      tileMetricId = params?.tile?.metric?.id;
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricData', {
        params
      });
      switch (tileMetricId) {
        case ENUM_LIVE_TILE_METRIC_ID.CONVERSATIONS_COUNT_V1:
          retVal = this.retrieveTileMetricDataConversationsCountV1(params);
          break;
        //
        case ENUM_LIVE_TILE_METRIC_ID.MESSAGES_ACTION_NEEDED_COUNT_V1:
          retVal = this.retrieveTileMetricDataMessagesActionNeededCountV1(params);
          break;
        case ENUM_LIVE_TILE_METRIC_ID.MESSAGES_COUNT_V1:
          retVal = this.retrieveTileMetricDataMessagesCountV1(params);
          break;
        case ENUM_LIVE_TILE_METRIC_ID.MESSAGES_AVG_PER_CONVERSATION_V1:
          retVal = this.retrieveTileMetricDataMessagesAvgPerConversationV1(params);
          break;
        case ENUM_LIVE_TILE_METRIC_ID.MESSAGES_FALSE_POSITIVE_COUNT_V1:
          retVal = this.retrieveTileMetricDataMessagesFalsePositiveCountV1(params);
          break;
        case ENUM_LIVE_TILE_METRIC_ID.MESSAGES_FALSE_POSITIVE_PERCENTAGE_V1:
          retVal = this.retrieveTileMetricDataMessagesFalsePositivePercentageV1(params);
          break;
        //
        case ENUM_LIVE_TILE_METRIC_ID.UTTERANCES_ACTION_NEEDED_COUNT_V1:
          retVal = this.retrieveTileMetricDataUtterancesActionNeededCountV1(params);
          break;
        case ENUM_LIVE_TILE_METRIC_ID.UTTERANCES_AVG_PER_CONVERSATION_V1:
          retVal = this.retrieveTileMetricDataUtterancesAvgPerConversationV1(params);
          break;
        case ENUM_LIVE_TILE_METRIC_ID.UTTERANCES_COUNT_V1:
          retVal = this.retrieveTileMetricDataUtterancesCountV1(params);
          break;
        case ENUM_LIVE_TILE_METRIC_ID.UTTERANCES_FALSE_POSITIVE_COUNT_V1:
          retVal = this.retrieveTileMetricDataUtterancesFalsePositiveCountV1(params);
          break;
        case ENUM_LIVE_TILE_METRIC_ID.UTTERANCES_FALSE_POSITIVE_PERCENTAGE_V1:
          retVal = this.retrieveTileMetricDataUtterancesFalsePositivePercentageV1(params);
          break;
        case ENUM_LIVE_TILE_METRIC_ID.UTTERANCES_TRANSFERS_COUNT_V1:
          retVal = this.retrieveTileMetricDataUtterancesTransfersCountV1(params);
          break;
        case ENUM_LIVE_TILE_METRIC_ID.UTTERANCES_TRANSFERS_PERCENTAGE_V1:
          retVal = this.retrieveTileMetricDataUtterancesTransfersPercentageV1(params);
          break;
        //
        default:
          retVal = of();
          break;
      }
      return retVal;
    } catch (error: any) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricData', { error });
      throw error;
    }
  }

  retrieveTileMetricDataConversationsCountV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/metrics/conversations-count-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataConversationsCountV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataConversationsCountV1', { error });
      throw error;
    }
  }

  retrieveTileMetricDataMessagesActionNeededCountV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/metrics/messages-action-needed-count-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataMessagesActionNeededCountV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataMessagesActionNeededCountV1', { error });
      throw error;
    }
  }

  retrieveTileMetricDataMessagesCountV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/metrics/messages-count-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataMessagesCountV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataMessagesCountV1', { error });
      throw error;
    }
  }

  retrieveTileMetricDataMessagesAvgPerConversationV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/metrics/messages-avg-per-conversation-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataMessagesAvgPerConversationV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataMessagesAvgPerConversationV1', { error });
      throw error;
    }
  }

  retrieveTileMetricDataMessagesFalsePositiveCountV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/metrics/messages-false-positive-count-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataMessagesFalsePositiveCountV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataMessagesFalsePositiveCountV1', { error });
      throw error;
    }
  }

  retrieveTileMetricDataMessagesFalsePositivePercentageV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/metrics/messages-false-positive-percentage-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataMessagesFalsePositivePercentageV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataMessagesFalsePositivePercentageV1', { error });
      throw error;
    }
  }

  retrieveTileMetricDataUtterancesActionNeededCountV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/metrics/utterances-action-needed-count-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesActionNeededCountV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesActionNeededCountV1', { error });
      throw error;
    }
  }

  retrieveTileMetricDataUtterancesAvgPerConversationV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/metrics/utterances-avg-per-conversation-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesAvgPerConversationV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesAvgPerConversationV1', { error });
      throw error;
    }
  }

  retrieveTileMetricDataUtterancesCountV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/metrics/utterances-count-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesCountV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesCountV1', { error });
      throw error;
    }
  }

  retrieveTileMetricDataUtterancesFalsePositiveCountV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/metrics/utterances-false-positive-count-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesFalsePositiveCountV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesFalsePositiveCountV1', { error });
      throw error;
    }
  }

  retrieveTileMetricDataUtterancesFalsePositivePercentageV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/metrics/utterances-false-positive-percentage-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesFalsePositivePercentageV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesFalsePositivePercentageV1', { error });
      throw error;
    }
  }

  retrieveTileMetricDataUtterancesTransfersCountV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/metrics/utterances-transfers-count-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesTransfersCountV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesTransfersCounttV1', { error });
      throw error;
    }
  }

  retrieveTileMetricDataUtterancesTransfersPercentageV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/metrics/utterances-transfers-percentage-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesTransfersPercentageV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsTileMetricsDataService.getClassName(), 'retrieveTileMetricDataUtterancesTransfersPercentageV1', { error });
      throw error;
    }
  }

}
