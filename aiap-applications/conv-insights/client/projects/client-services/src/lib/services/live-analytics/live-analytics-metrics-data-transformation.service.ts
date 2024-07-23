/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import dateformat from 'dateformat';

import {
  _debugX, _errorX,
  ENUM_LIVE_METRIC_ID,
} from 'client-shared-utils';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class LiveAnalyticsMetricsDataTransformationService {

  static getClassName() {
    return 'LiveAnalyticsMetricsDataTransformationService';
  }

  constructor() { }

  public transfromMetricsData(query: any, chart: any, response: any) {
    const RESPONSE_TRANSFORMED = {};
    let metricIds;
    try {
      metricIds = Object.keys(response);
      if (
        !lodash.isEmpty(metricIds) &&
        lodash.isArray(metricIds)
      ) {
        for (let id of metricIds) {
          if (
            !lodash.isEmpty(id)
          ) {
            let data = response[id];
            RESPONSE_TRANSFORMED[id] = this.transformMetricData({ query, chart, metric: { id, data } });
          }
        }
      }
      const RET_VAL = this.mergeMetricsData(RESPONSE_TRANSFORMED);
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transfromMetricsData', { error });
      throw error;
    }
  }

  private transformMetricData(params: any) {
    let metricId: any;
    let metricData: any;
    let retVal: any;
    try {
      metricId = params?.metric?.id;
      metricData = params?.metric?.data;
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricData', {
        params
      });
      if (
        !lodash.isEmpty(metricId) &&
        lodash.isArray(metricData)
      ) {
        switch (metricId) {
          case ENUM_LIVE_METRIC_ID.CONVERSATIONS_V1:
            retVal = this.transformMetricDataConversationsV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.CONV_DURATION_AVG_IN_MINUTES_V1:
            retVal = this.transformMetricDataConvDurationAvgInMinutesV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.TRANSFERS_TO_AGENT_V1:
            retVal = this.transformMetricDataTransfersToAgentV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.MESSAGES_PER_CONVERSATION_AVG_COUNT_V1:
            retVal = this.transformMetricDataMessagesPerConversationAvgCountV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.MESSAGES_V1:
            retVal = this.transformMetricDataMessagesV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.CONVERSATIONS_WITH_USER_INTERACTION_V1:
            retVal = this.transformMetricDataConversationsWithUserInteractionV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.CONVERSATIONS_WITHOUT_USER_INTERACTION_V1:
            retVal = this.transformMetricDataConversationsWithoutUserInteractionV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.TOP_INTENTS_V1:
            retVal = this.transformMetricDataTopIntentsV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.TOP_INTENTS_WITH_FEEDBACK_V1:
            retVal = this.transformMetricDataTopIntentsWithFeedbackV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.LOW_CONFIDENCE_INTENTS_V1:
            retVal = this.transformMetricDataLowConfidenceIntentsV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.LAST_INTENT_BEFORE_TRANSFER_V1:
            retVal = this.transformMetricDataLastIntentBeforeTransferV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.UTTERANCES_BY_SKILL_V1:
            retVal = this.transformMetricDataUtterancesBySkillV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.CONVERSATIONS_V2:
            retVal = this.transformMetricDataConversationV2(params);
            break;
          case ENUM_LIVE_METRIC_ID.USERS_V1:
            retVal = this.transformMetricDataUsersV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USERS_NEW_V1:
            retVal = this.transformMetricDataUsersNewV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USERS_RETURNING_V1:
            retVal = this.transformMetricDataUsersReturningV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USERS_FROM_LANDING_PAGE_V1:
            retVal = this.transformMetricDataUsersLandingPageV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USERS_FROM_S2P_PAGE_V1:
            retVal = this.transformMetricDataUsersS2pPageV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USERS_FROM_SLACK_V1:
            retVal = this.transformMetricDataUsersSlackV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.SURVEYS_POSITIVE_V1:
            retVal = this.transformMetricDataSurveysPositiveV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.SURVEYS_POSITIVE_TARGET_V1:
            retVal = this.transformMetricDataSurveysPositiveTargetV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.FEEDBACKS_POSITIVE_V1:
            retVal = this.transformMetricDataFeedbacksPositiveV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.FEEDBACKS_POSITIVE_TARGET_V1:
            retVal = this.transformMetricDataFeedbacksPositiveTargetV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.RESPONSE_CONFIDENCE_V1:
            retVal = this.transformMetricDataResponseConfidenceV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.RESPONSE_CONFIDENCE_TARGET_V1:
            retVal = this.transformMetricDataResponseConfidenceTargetV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USAGE_BY_COUNTRY_V1:
            retVal = this.transformMetricDataUsageByCountryV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_TRANSFER_TO_AGENT_V1:
            retVal = this.transformMetricDataUsageByGroupTransferToAgentV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_ACCOUNTING_V1:
            retVal = this.transformMetricDataUsageByGroupAccountingV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_APPROVER_FLOW_V1:
            retVal = this.transformMetricDataUsageByGroupApproverV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_BUYER_INFORMATION_V1:
            retVal = this.transformMetricDataUsageByGroupBuyerInformationV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_ERROR_MESSAGE_V1:
            retVal = this.transformMetricDataUsageByGroupErrorMessageV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USAGE_BY_GROUP_GOODS_REQUESTS_V1:
            retVal = this.transformMetricDataUsageByGroupGoodsRequestsV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.POP_TICKETS_FROM_VA_V1:
            retVal = this.transformMetricPopTicketsFromVaV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.PSIS_TICKETS_FROM_VA_V1:
            retVal = this.transformMetricPsisTicketsFromVaV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.POP_AND_PSIS_CHATS_TICKETS_FROM_VA_V1:
            retVal = this.transformMetricPopAndPsisTicketsFromVaV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.POP_CHATS_FROM_VA_V1:
            retVal = this.transformMetricPopChatsFromVaV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USERS_TOTAL_REQUESTERS_V1:
            retVal = this.transformMetricDataUsersRequestersV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USERS_TOTAL_BUYERS_V1:
            retVal = this.transformMetricDataUsersBuyersV1(params);
            break;
          case ENUM_LIVE_METRIC_ID.USERS_TOTAL_SUPPLIERS_V1:
            retVal = this.transformMetricDataUsersSuppliersV1(params);
            break;
          default:
            break;
        }
      }
      return retVal;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricData', { error, params });
      throw error;
    }
  }

  private mergeMetricsData(metricsData: any) {
    let metricIds;
    let metricId;
    let retVal;
    try {
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'mergeMetricsData', { metricsData });
      metricIds = Object.keys(metricsData);
      if (
        !lodash.isEmpty(metricIds) &&
        lodash.isArray(metricIds)
      ) {
        if (
          metricIds.length == 1
        ) {
          metricId = metricIds[0];
          retVal = metricsData[metricId];
        } else if (
          metricIds.length > 1
        ) {
          retVal = {
            y: []
          };
          for (let tmpMetricId of metricIds) {
            let tmpMetricData = metricsData[tmpMetricId];
            if (
              lodash.isEmpty(retVal?.x) &&
              !lodash.isEmpty(tmpMetricData?.x)
            ) {
              retVal.x = tmpMetricData?.x;
            }
            if (
              !lodash.isEmpty(tmpMetricData?.y) &&
              lodash.isArray(tmpMetricData?.y)
            ) {
              retVal.y.push(tmpMetricData.y[0]);
            }
          }
        }
      }
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'mergeMetricsData', {
        metricsData,
        metricIds,
        retVal,
      });
      return retVal;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'mergeMetricsData', { error, metricsData });
      throw error;
    }
  }

  private transformMetricDataConversationsV1(params: any) {
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;

      const RET_VAL: any = {};

      const LABELS = metricData.map((record: any) => record.day);
      const DATASET = metricData.map((record: any) => record.conv_count);

      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];

      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataConversationsV1', { RET_VAL, params });
      return RET_VAL;

    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataConversationsV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataConvDurationAvgInMinutesV1(params: any) {
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;

      const RET_VAL: any = {};

      const LABELS = metricData.map((record: any) => record.day);
      const DATASET = metricData.map((record: any) => record.avg_duration);

      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];

      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataConvDurationAvgInMinutesV1', { RET_VAL, params });
      return RET_VAL;

    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataConvDurationAvgInMinutesV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataTransfersToAgentV1(params: any) {
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;

      const RET_VAL: any = {};

      const LABELS = metricData.map((record: any) => record.day);
      const DATASET = metricData.map((record: any) => record.total);

      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];

      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataTransfersToAgentV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataTransfersToAgentV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataMessagesPerConversationAvgCountV1(params: any) {
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;

      const RET_VAL: any = {};

      const LABELS = metricData.map((record: any) => record.day);
      const DATASET = metricData.map((record: any) => record.avg);

      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];

      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataMessagesPerConversationAvgCountV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataMessagesPerConversationAvgCountV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataMessagesV1(params: any) {
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;

      const RET_VAL: any = {};

      const LABELS = metricData.map((record: any) => record.day);
      const DATASET = metricData.map((record: any) => record.total);

      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];

      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataMessagesV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataMessagesV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataConversationsWithUserInteractionV1(params: any) {
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;

      const RET_VAL: any = {};

      const LABELS = metricData.map((record: any) => record.day);
      const DATASET = metricData.map((record: any) => record.total);

      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];

      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataConversationsWithUserInteractionV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataConversationsWithUserInteractionV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataConversationsWithoutUserInteractionV1(params: any) {
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;

      const RET_VAL: any = {};

      const LABELS = metricData.map((record: any) => record.day);
      const DATASET = metricData.map((record: any) => record.total);

      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];

      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataConversationsWithoutUserInteractionV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataConversationsWithoutUserInteractionV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataTopIntentsV1(params: any) {
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;

      const RET_VAL: any = {};

      const LABELS = metricData.map((record: any) => '#' + record.intent);
      const DATASET = metricData.map((record: any) => record.total);

      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];

      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataTopIntentsV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataTopIntentsV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataTopIntentsWithFeedbackV1(params: any) {
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;

      const RET_VAL: any = {};

      const LABELS = metricData.map((record: any) => '#' + record.intent);
      const DATASET = metricData.map((record: any) => record.total);

      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];

      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataTopIntentsWithFeedbackV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataTopIntentsWithFeedbackV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataLowConfidenceIntentsV1(params: any) {
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;

      const RET_VAL: any = {};

      const LABELS = metricData.map((record: any) => '#' + record.intent);
      const DATASET = metricData.map((record: any) => record.total);

      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];

      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataLowConfidenceIntentsV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataLowConfidenceIntentsV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataLastIntentBeforeTransferV1(params: any) {
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;

      const RET_VAL: any = {};

      const LABELS = metricData.map((record: any) => '#' + record.intent);
      const DATASET = metricData.map((record: any) => record.total);

      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];

      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataLastIntentBeforeTransferV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataLastIntentBeforeTransferV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataUtterancesBySkillV1(params: any) {
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;

      const RET_VAL: any = {};

      const LABELS = metricData.map((record: any) => '#' + record.aiSkill);
      const DATASET = metricData.map((record: any) => record.total);

      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];

      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUtterancesBySkillV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUtterancesBySkillV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataConversationV2(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;

      const RET_VAL: any = {};

      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];

      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataConversationV2', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataConversationV2', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsersV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsersRequestersV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersRequesters', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersRequesters', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsersBuyersV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersBuyers', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersBuyers', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsersSuppliersV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersSuppliers', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersSuppliers', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsersNewV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersNewV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersNewV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsersReturningV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersReturningV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersReturningV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsersLandingPageV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersLandingPageV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersLandingPageV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsersS2pPageV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersS2pPageV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersS2pPageV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsageByCountryTargetV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByCountryTargetV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByCountryTargetV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsersSlackV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersSlackV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsersSlackV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataSurveysPositiveV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataSurveysPositiveV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataSurveysPositiveV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataSurveysPositiveTargetV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataSurveysPositiveTargetV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataSurveysPositiveTargetV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataFeedbacksPositiveV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataFeedbacksPositiveV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataFeedbacksPositiveV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataFeedbacksPositiveTargetV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataFeedbacksPositiveTargetV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataFeedbacksPositiveTargetV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataResponseConfidenceV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataResponseConfidenceV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataResponseConfidenceV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataResponseConfidenceTargetV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataResponseConfidenceTargetV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataResponseConfidenceTargetV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsageByCountryV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    const TARGET_ATTRIBUTE = "name";

    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      RET_VAL.x = LABELS;
      const PARAMS = {
        targetAttribute: TARGET_ATTRIBUTE,
        data: metricData,
        chartType: metricDefinition?.chartType,
        monthsList: MONTHS_LIST
      }
      RET_VAL.y = this._splitGroupedDataset(PARAMS);
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByCountryV1', { RET_VAL, params });

      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByCountryV1', { error, params });
      throw error;
    }
  }

  private _splitGroupedDataset(params: any) {
    let metricGroupData = {};
    let targetAttribute = params.targetAttribute;
    let data = params.data;
    let chartType = params.chartType;
    let monthsList = params.monthsList;
    const RET_VAL = [];

    let datasetByGroup = new Array(monthsList.length).fill(0);
    if (!lodash.isEmpty(data)) {
      data.forEach(object => {
        let keyAttribute = object[targetAttribute];
        metricGroupData[keyAttribute] = { month: object.month, year: object.year, count: object.count };
      });
      for (let key in metricGroupData) {
        datasetByGroup = this.mapDataToMonthList(monthsList, [metricGroupData[key]]);
        RET_VAL.push({ [targetAttribute]: key, metric_data: datasetByGroup, type: chartType });
      }
    }
    return RET_VAL;
  }

  private transformMetricDataUsageByGroupTransferToAgentV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByGroupTransferToAgentV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByGroupTransferToAgentV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsageByGroupAccountingV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByGroupAccountingV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByGroupAccountingV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsageByGroupApproverV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByGroupApproverV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByGroupApproverV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsageByGroupBuyerInformationV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByGroupBuyerInformationV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByGroupBuyerInformationV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsageByGroupErrorMessageV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByGroupErrorMessageV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByGroupErrorMessageV1', { error, params });
      throw error;
    }
  }

  private transformMetricDataUsageByGroupGoodsRequestsV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByGroupGoodsRequestsV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataUsageByGroupGoodsRequestsV1', { error, params });
      throw error;
    }
  }

  private transformMetricPopTicketsFromVaV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricPopTicketsFromVaV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricPopTicketsFromVaV1', { error, params });
      throw error;
    }
  }

  private transformMetricPsisTicketsFromVaV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricPsisTicketsFromVaV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricPsisTicketsFromVaV1', { error, params });
      throw error;
    }
  }

  private transformMetricPopAndPsisTicketsFromVaV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricPopAndPsisTicketsFromVaV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricPopAndPsisTicketsFromVaV1', { error, params });
      throw error;
    }
  }

  private transformMetricPopChatsFromVaV1(params: any) {
    let query: any;
    let chart: any;
    let metricId: any;
    let metricDefinition: any;
    let metricData: any;
    try {
      query = params?.query;
      chart = params?.chart;
      metricId = params?.metric?.id;
      metricDefinition = this.retrieveMetricDefinitionFromChart({ chart, metricId });
      metricData = params?.metric?.data;
      const RET_VAL: any = {};
      const MONTHS_LIST = this.constructMonthsListFromQuery(query);
      const LABELS = MONTHS_LIST.map((item: any) => item.label);
      const DATASET = this.mapDataToMonthList(MONTHS_LIST, metricData);
      RET_VAL.x = LABELS;
      RET_VAL.y = [{ name: metricDefinition?.name, metric_data: DATASET, type: metricDefinition?.chartType }];
      _debugX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricPopChatsFromVaV1', { RET_VAL, params });
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricPopChatsFromVaV1', { error, params });
      throw error;
    }
  }

  private mapDataToMonthList(monthList: any, data: any) {
    const RET_VAL = monthList.map((item: any) => {
      const SEARCH_FOR_DATA_ITEM = (tmpItem: any) => {
        let retVal = false;

        let itemMonth = lodash.isString(item?.month) ? parseInt(item?.month) : item?.month;
        let itemYear = lodash.isString(item?.year) ? parseInt(item?.year) : item?.year;

        let tmpItemMonth = lodash.isString(tmpItem?.month) ? parseInt(tmpItem?.month) : tmpItem?.month;
        let tmpItemYear = lodash.isString(tmpItem?.year) ? parseInt(tmpItem?.year) : tmpItem?.year;

        if (
          itemMonth + 1 === tmpItemMonth &&
          itemYear === tmpItemYear
        ) {
          retVal = true;
        }
        return retVal;
      }
      let dataItem = data.find(SEARCH_FOR_DATA_ITEM);
      let retVal = 0;
      if (
        dataItem?.count &&
        dataItem?.count > 0
      ) {
        retVal = dataItem?.count;
      }
      return retVal;
    });
    return RET_VAL;
  }

  private constructMonthsListFromQuery(query: any) {
    let dateRangeFrom;
    let dateRangeTo;
    const RET_VAL = [];
    try {
      dateRangeFrom = query?.filter?.dateRange?.from;
      dateRangeTo = query?.filter?.dateRange?.to;
      let dateFrom = new Date(dateRangeFrom);
      let dateTo = new Date(dateRangeTo);

      let monthDate = new Date(dateRangeFrom);
      const MONTHS_COUNT = dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear());
      for (let i = 0; i <= MONTHS_COUNT; i++) {
        let year = monthDate.getFullYear();
        let month = monthDate.getMonth();
        let label = dateformat(monthDate, "mmm, yyyy");

        RET_VAL.push({ year, month, label });
        monthDate.setMonth(monthDate.getMonth() + 1);
      }
      return RET_VAL;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'constructMonthsFromQuery', { error, query });
      throw error;
    }
  }

  private retrieveMetricDefinitionFromChart(params: any) {
    let metricId: any;
    let metrics: any;

    let retVal: any;
    try {
      metricId = params?.metricId;
      metrics = params?.chart?.metrics;
      if (
        !lodash.isEmpty(metrics) &&
        lodash.isArray(metrics)
      ) {
        retVal = metrics.find((tmpItem: any) => tmpItem.id === metricId);
      }
      return retVal;
    } catch (error: any) {
      _errorX(LiveAnalyticsMetricsDataTransformationService.getClassName(), 'transformMetricDataConversationsV1', { error, params });
      throw error;
    }
  }

  // TODO LEGACY STUFF -> probably we need to remove it

  public transformData(name, data, query) {
    switch (name) {
      case 'feedbacks':
        return this.transformFeedbacks(data);
    }
  }

  private transformFeedbacks(data) {
    return {
      x: data.map((record) => record.feedback),
      y: data.map((record) => record.total),
    };
  }

}
