/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX,
  ENUM_LIVE_METRIC_ID,
} from 'client-shared-utils';

import {
  SessionServiceV1,
  BaseServiceV1,
  EnvironmentServiceV1,
} from 'client-shared-services';

@Injectable({
  providedIn: 'root'
})
export class LiveAnalyticsMetricsDataService extends BaseServiceV1 {

  static getClassName() {
    return 'LiveAnalyticsMetricsDataService';
  }

  constructor(
    protected environmentService: EnvironmentServiceV1,
    protected sessionService: SessionServiceV1,
    private http: HttpClient,
  ) {
    super(environmentService, sessionService);
  }

  retrieveMetricsData(params: any) {
    let metrics;
    let configuration;
    try {
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricsData', { params });
      metrics = params?.metrics;
      configuration = params?.configuration;
      const FORK_JOIN_SOURCES: any = {};
      if (
        !lodash.isEmpty(metrics) &&
        lodash.isArray(metrics)
      ) {
        for (let metric of metrics) {
          if (
            !lodash.isEmpty(metric?.id)
          ) {
            let metricConfiguration;
            if (
              lodash.isArray(configuration?.metrics)
            ) {
              metricConfiguration = configuration.metrics.find((item: any) => metric?.id === item?.id);
            }
            let query = lodash.merge(
              lodash.cloneDeep(params?.query),
              {
                filter: configuration?.filter,
                nFilter: configuration?.nFilter,
              },
              {
                filter: metricConfiguration?.filter,
                nFilter: metricConfiguration?.nFilter,
                options: metricConfiguration?.options,
              },
            );
            FORK_JOIN_SOURCES[metric.id] = this.retrieveMetricData({ metric, query, configuration });
          }
        }
      }
      const RET_VAL = forkJoin(FORK_JOIN_SOURCES);
      return RET_VAL;
    } catch (error) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricsDataByQuery', { params });
      throw error;
    }
  }

  retrieveMetricData(params: any) {
    let metricId;
    let retVal;
    try {
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricData', { params });
      metricId = params?.metric?.id;
      switch (metricId) {
        case ENUM_LIVE_METRIC_ID.CONVERSATIONS_V1:
          retVal = this.retrieveMetricDataConversationsV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.CONV_DURATION_AVG_IN_MINUTES_V1:
          retVal = this.retrieveMetricDataConvDurationAvgInMinutesV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.TRANSFERS_TO_AGENT_V1:
          retVal = this.retrieveMetricDataTransfersToAgentV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.MESSAGES_PER_CONVERSATION_AVG_COUNT_V1:
          retVal = this.retrieveMetricDataMessagesPerConversationAvgCountV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.MESSAGES_V1:
          retVal = this.retrieveMetricDataMessagesV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.CONVERSATIONS_WITH_USER_INTERACTION_V1:
          retVal = this.retrieveMetricDataConversationsWithUserInteractionV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.CONVERSATIONS_WITHOUT_USER_INTERACTION_V1:
          retVal = this.retrieveMetricDataConversationsWithOutUserInteractionV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.TOP_INTENTS_V1:
          retVal = this.retrieveMetricDataTopIntentsV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.TOP_INTENTS_WITH_FEEDBACK_V1:
          retVal = this.retrieveMetricDataTopIntentsWithFeedbackV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.LOW_CONFIDENCE_INTENTS_V1:
          retVal = this.retrieveMetricDataLowConfidenceIntentsV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.LAST_INTENT_BEFORE_TRANSFER_V1:
          retVal = this.retrieveMetricDataLastIntentBeforeTransferV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.UTTERANCES_BY_SKILL_V1:
          retVal = this.retrieveMetricDataUtterancesBySkillV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.CONVERSATIONS_V2:
          retVal = this.retrieveMetricDataConversationsV2(params);
          break;
        case ENUM_LIVE_METRIC_ID.USERS_V1:
          retVal = this.retrieveMetricDataUsersV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.USERS_NEW_V1:
          retVal = this.retrieveMetricDataUsersNewV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.USERS_RETURNING_V1:
          retVal = this.retrieveMetricDataUsersReturningV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.USERS_FROM_LANDING_PAGE_V1:
          retVal = this.retrieveMetricDataUsersFromLandingPageV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.USERS_FROM_S2P_PAGE_V1:
          retVal = this.retrieveMetricDataUsersFromS2pPageV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.USERS_FROM_SLACK_V1:
          retVal = this.retrieveMetricDataUsersFromSlackV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.SURVEYS_POSITIVE_V1:
          retVal = this.retrieveMetricDataSurveysPositiveV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.SURVEYS_POSITIVE_TARGET_V1:
          retVal = this.retrieveMetricDataSurveysPositiveTargetV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.FEEDBACKS_POSITIVE_V1:
          retVal = this.retrieveMetricDataFeedbacksPositiveV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.FEEDBACKS_POSITIVE_TARGET_V1:
          retVal = this.retrieveMetricDataFeedbacksPositiveTargetV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.RESPONSE_CONFIDENCE_V1:
          retVal = this.retrieveMetricDataResponseConfidenceV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.RESPONSE_CONFIDENCE_TARGET_V1:
          retVal = this.retrieveMetricDataResponseConfidenceTargetV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.USAGE_BY_COUNTRY_V1:
          retVal = this.retrieveMetricDataUsageByCountryV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_TRANSFER_TO_AGENT_V1:
          retVal = this.retrieveMetricDataUsageByGroupTransferToAgentV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_GOODS_REQUESTS_V1:
          retVal = this.retrieveMetricDataUsageByGroupGoodsRequestsV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_ACCOUNTING_V1:
          retVal = this.retrieveMetricDataUsageByGroupAccountingV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_APPROVER_FLOW_V1:
          retVal = this.retrieveMetricDataUsageByGroupApproverFlowV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_ERROR_MESSAGE_V1:
          retVal = this.retrieveMetricDataUsageByGroupErrorMessageV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_BUYER_INFORMATION_V1:
          retVal = this.retrieveMetricDataUsageByGroupBuyerInformationV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.POP_CHATS_FROM_VA_V1:
          retVal = this.retrieveMetricDataPopChatsFromVaV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.POP_TICKETS_FROM_VA_V1:
          retVal = this.retrieveMetricDataPopTicketsFromVaV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.PSIS_TICKETS_FROM_VA_V1:
          retVal = this.retrieveMetricDataPsisTicketsFromVaV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.POP_AND_PSIS_CHATS_TICKETS_FROM_VA_V1:
          retVal = this.retrieveMetricDataPopAndPsisChatsTicketsFromVaV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.POP_CHATS_FROM_ZENDESK_V1:
          retVal = this.retrieveMetricDataPopChatsFromZendeskV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.POP_TICKETS_FROM_ZENDESK_V1:
          retVal = this.retrieveMetricDataPopTicketsFromZendeskV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.PSIS_TICKETS_FROM_ZENDESK_V1:
          retVal = this.retrieveMetricDataPsisTicketsFromZendeskV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.POP_AND_PSIS_CHATS_AND_TICKETS_V1:
          retVal = this.retrieveMetricDataPopAndPsisChatsAndTicketsV1(params);
          break;
        case ENUM_LIVE_METRIC_ID.USERS_TOTAL_REQUESTERS_V1:
          retVal = this.retrieveMetricDataUsersTotalRequestors(params);
          break;
        case ENUM_LIVE_METRIC_ID.USERS_TOTAL_BUYERS_V1:
          retVal = this.retrieveMetricDataUsersTotalBuyers(params);
          break;
        case ENUM_LIVE_METRIC_ID.USERS_TOTAL_SUPPLIERS_V1:
          retVal = this.retrieveMetricDataUsersTotalSuppliers(params);
          break;
        default:
          break;
      }
      return retVal;
    } catch (error) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricData', { params });
      throw error;
    }
  }

  retrieveMetricDataConversationsV1(params: any) {
    let query;
    let dateRange;
    let httpPath;
    try {
      query = params?.query;
      dateRange = query?.filter?.dateRange;
      if (
        this._isWithinDayLength(dateRange)
      ) {
        httpPath = '/api/v1/analytics-live/conversations/group-by-hour';
      } else {
        httpPath = '/api/v1/analytics-live/conversations/group-by-day';
      }
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataConversationV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataConversationV1', { error });
      throw error;
    }
  }

  retrieveMetricDataConversationsV2(params: any) {
    let query;
    let httpPath;
    try {
      httpPath = '/api/v1/analytics-live/conversations/group-by-month';
      query = params?.query;

      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataConversationV2', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataConversationV2', { error });
      throw error;
    }
  }

  retrieveMetricDataConvDurationAvgInMinutesV1(params: any) {
    let query;
    let dateRange;
    let httpPath;
    try {
      query = params?.query;
      dateRange = query?.filter?.dateRange;
      if (
        this._isWithinDayLength(dateRange)
      ) {
        httpPath = '/api/v1/analytics-live/conversations/avg-duration-group-by-hour';
      } else {
        httpPath = '/api/v1/analytics-live/conversations/avg-duration-group-by-day';
      }
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataConvDurationAvgInMinutesV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataConvDurationAvgInMinutesV1', { error });
      throw error;
    }
  }

  retrieveMetricDataMessagesPerConversationAvgCountV1(params: any) {
    let query;
    let dateRange;
    let httpPath;
    try {
      query = params?.query;
      dateRange = query?.filter?.dateRange;
      if (
        this._isWithinDayLength(dateRange)
      ) {
        httpPath = '/api/v1/analytics-live/utterances/avg-per-conversation-by-query-group-by-hour';
      } else {
        httpPath = '/api/v1/analytics-live/utterances/avg-per-conversation-by-query-group-by-day';
      }
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataConvDurationAvgInMinutesV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataMessagesPerConversationAvgCountV1', { error });
      throw error;
    }
  }

  retrieveMetricDataMessagesV1(params: any) {
    let query;
    let dateRange;
    let httpPath;
    try {
      query = params?.query;
      dateRange = query?.filter?.dateRange;
      if (
        this._isWithinDayLength(dateRange)
      ) {
        httpPath = '/api/v1/analytics-live/utterances/count-by-query-group-by-hour';
      } else {
        httpPath = '/api/v1/analytics-live/utterances/count-by-query-group-by-day';
      }
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataMessagesV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataMessagesV1', { error });
      throw error;
    }
  }

  retrieveMetricDataTransfersToAgentV1(params: any) {
    let query;
    let dateRange;
    let httpPath;
    try {
      query = params?.query;
      dateRange = query?.filter?.dateRange;
      if (
        this._isWithinDayLength(dateRange)
      ) {
        httpPath = '/api/v1/analytics-live/utterances/transfer-totals-group-by-hour';
      } else {
        httpPath = '/api/v1/analytics-live/utterances/transfer-totals-group-by-day';
      }
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataTransfersToAgentV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataTransfersToAgentV1', { error });
      throw error;
    }
  }

  retrieveMetricDataConversationsWithUserInteractionV1(params: any) {
    let query;
    let dateRange;
    let httpPath;
    let interaction = true;
    try {

      query = params?.query;
      dateRange = query?.filter?.dateRange;
      if (
        this._isWithinDayLength(dateRange)
      ) {
        httpPath = '/api/v1/analytics-live/conversations/with-user-interaction-group-by-hour';
      } else {
        httpPath = '/api/v1/analytics-live/conversations/with-user-interaction-group-by-day';
      }
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query, interaction };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataConversationsWithUserInteractionV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataConversationsWithUserInteractionV1', { error });
      throw error;
    }
  }

  retrieveMetricDataConversationsWithOutUserInteractionV1(params: any) {
    let query;
    let dateRange;
    let httpPath;
    let interaction = false;
    try {
      query = params?.query;
      dateRange = query?.filter?.dateRange;
      if (
        this._isWithinDayLength(dateRange)
      ) {
        httpPath = '/api/v1/analytics-live/conversations/with-user-interaction-group-by-hour';
      } else {
        httpPath = '/api/v1/analytics-live/conversations/with-user-interaction-group-by-day';
      }
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query, interaction };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataConversationsWithOutUserInteractionV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataConversationsWithOutUserInteractionV1', { error });
      throw error;
    }
  }

  retrieveMetricDataTopIntentsV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/top-intents-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataTopIntentsV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataTopIntentsV1', { error });
      throw error;
    }
  }

  retrieveMetricDataTopIntentsWithFeedbackV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/neg-top-intents-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataTopIntentsWithFeedbackV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataTopIntentsWithFeedbackV1', { error });
      throw error;
    }
  }

  retrieveMetricDataLowConfidenceIntentsV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/low-confidence-intents-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataLowConfidenceIntentsV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataLowConfidenceIntentsV1', { error });
      throw error;
    }
  }

  retrieveMetricDataLastIntentBeforeTransferV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/transfer-intents-by-query';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataLastIntentBeforeTransferV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataLastIntentBeforeTransferV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUtterancesBySkillV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/count-by-query-group-by-ai-skill';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUtterancesBySkillV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUtterancesBySkillV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsersV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/users/find-total-users-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsersNewV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/users/find-new-users-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersNewV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersNewV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsersReturningV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/users/find-returning-users-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersReturningV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersReturningV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsersFromLandingPageV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/conversations/find-channel-users-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersFromLandingPageV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersFromLandingPageV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsersFromS2pPageV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/conversations/find-channel-users-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersFromS2pPageV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersFromS2pPageV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsersFromSlackV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/conversations/find-channel-users-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersFromSlackV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersFromSlackV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsersTotalBuyers(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/find-users-persona-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersFromSlackV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersFromSlackV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsersTotalRequestors(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/find-users-persona-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersTotalRequestors', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersTotalRequestors', { error });
      throw error;
    }
  }

  retrieveMetricDataUsersTotalSuppliers(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/find-users-persona-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersTotalSuppliers', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsersTotalSuppliers', { error });
      throw error;
    }
  }

  retrieveMetricDataSurveysPositiveV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/surveys/find-positive-surveys-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataSurveysPositiveV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataSurveysPositiveV1', { error });
      throw error;
    }
  }

  retrieveMetricDataSurveysPositiveTargetV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/surveys/find-positive-surveys-target-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataSurveysPositiveTargetV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataSurveysPositiveTargetV1', { error });
      throw error;
    }
  }

  retrieveMetricDataFeedbacksPositiveV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/feedbacks/find-positive-feedbacks-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataFeedbacksPositiveV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataFeedbacksPositiveV1', { error });
      throw error;
    }
  }

  retrieveMetricDataFeedbacksPositiveTargetV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/feedbacks/find-positive-feedbacks-target-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataFeedbacksPositiveTargetV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataFeedbacksPositiveTargetV1', { error });
      throw error;
    }
  }

  retrieveMetricDataResponseConfidenceV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/find-response-confidence-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataResponseConfidenceV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataResponseConfidenceV1', { error });
      throw error;
    }
  }

  retrieveMetricDataResponseConfidenceTargetV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/find-response-confidence-target-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataResponseConfidenceTargetV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataResponseConfidenceTargetV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsageByCountryV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/users/find-usage-by-country-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByCountryV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByCountryV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsageByGroupTransferToAgentV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/usage-by-group/find-connect-to-agent-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByGroupTransferToAgentV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByGroupTransferToAgentV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsageByGroupGoodsRequestsV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/usage-by-group/find-goods-requests-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByGroupGoodsRequestsV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByGroupGoodsRequestsV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsageByGroupAccountingV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/usage-by-group/find-accounting-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByGroupAccountingV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByGroupAccountingV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsageByGroupApproverFlowV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/usage-by-group/find-approver-flow-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByGroupApproverFlowV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByGroupApproverFlowV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsageByGroupErrorMessageV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/usage-by-group/find-error-message-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByGroupErrorMessageV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByGroupErrorMessageV1', { error });
      throw error;
    }
  }

  retrieveMetricDataUsageByGroupBuyerInformationV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/usage-by-group/find-buyer-information-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByGroupBuyerInformationV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataUsageByGroupBuyerInformationV1', { error });
      throw error;
    }
  }

  retrieveMetricDataPopChatsFromVaV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/find-chats-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPopChatsFromVaV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPopChatsFromVaV1', { error });
      throw error;
    }
  }

  retrieveMetricDataPopTicketsFromVaV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/find-tickets-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPopTicketsFromVaV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPopTicketsFromVaV1', { error });
      throw error;
    }
  }

  retrieveMetricDataPsisTicketsFromVaV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/find-tickets-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPsisTicketsFromVaV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPsisTicketsFromVaV1', { error });
      throw error;
    }
  }

  retrieveMetricDataPopAndPsisChatsTicketsFromVaV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/find-chats-tickets-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPsisTicketsFromVaV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPopAndPsisChatsTicketsFromVaV1', { error });
      throw error;
    }
  }

  retrieveMetricDataPopChatsFromZendeskV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/find-zendesk-pop-chats-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPopChatsFromZendeskV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPopChatsFromZendeskV1', { error });
      throw error;
    }
  }

  retrieveMetricDataPopTicketsFromZendeskV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/find-zendesk-pop-tickets-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPopChatsFromZendeskV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPopTicketsFromZendeskV1', { error });
      throw error;
    }
  }

  retrieveMetricDataPsisTicketsFromZendeskV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/find-zendesk-psis-tickets-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPsisTicketsFromZendeskV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPsisTicketsFromZendeskV1', { error });
      throw error;
    }
  }

  retrieveMetricDataPopAndPsisChatsAndTicketsV1(params: any) {
    let query;
    let httpPath;
    try {
      query = params?.query;
      httpPath = '/api/v1/analytics-live/utterances/find-zendesk-pop-chats-tickets-psis-tickets-by-query-month-groups';
      const REQUEST_URL = `${this._hostUrl()}${httpPath}`;
      const REQUEST = { query };
      const REQUEST_OPTIONS = this._requestOptions();
      _debugX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPopAndPsisChatsAndTicketsV1', {
        REQUEST_URL,
        REQUEST,
        REQUEST_OPTIONS
      });
      return this.http.post(REQUEST_URL, REQUEST, REQUEST_OPTIONS);
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataService.getClassName(), 'retrieveMetricDataPopAndPsisChatsAndTicketsV1', { error });
      throw error;
    }
  }

  private _isWithinDayLength(range: any) {
    let retVal = false;
    if (
      range?.from &&
      range?.to
    ) {
      const DURATION_IN_TIME = range.to.getTime() - range.from.getTime();
      const DURATION_IN_DAY = DURATION_IN_TIME / (1000 * 3600 * 24);
      if (DURATION_IN_DAY <= 1) {
        retVal = true;
      }
    }
    return retVal;
  }

}
