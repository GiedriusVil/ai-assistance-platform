/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-logs-retrieve-many-by-query-flatten';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  AI_SERVICE_TYPE_ENUM,
  IAiLogRecordExternalV1V1WaV1,
  IAiLogRecordV1,
  IAiSkillV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  splitDate,
  splitTime,
} from '@ibm-aiap/aiap-utils-date';

import {
  retrieveManyByQuery,
} from './retrieve-many-by-query';


const _flattenLogForWaV1 = (
  log: IAiLogRecordV1,
): IAiLogRecordV1 => {
  let external: IAiLogRecordExternalV1V1WaV1;
  try {
    external = log?.external as IAiLogRecordExternalV1V1WaV1;

    const LOG_ID = external?.log_id;
    const USER_ID = external?.response?.context?.metadata?.user_id;
    const CONVERSATION_ID = external?.response?.context?.conversation_id;
    const REQUEST_TEXT = external?.request?.input?.text || '';
    const RESPONSE_TEXT = ramda.pathOr('', [0], external?.response?.output?.text);
    const VISITED_NODES = external?.response?.output?.nodes_visited;
    const INTENTS = external?.response?.intents || [];
    const ENTITIES = external?.response?.entities || [];
    const TOP_INTENT = ramda.pathOr({}, [0], INTENTS);
    const TOP_ENTITY = ramda.pathOr({}, [0], ENTITIES);

    const RET_VAL = {
      type: AI_SERVICE_TYPE_ENUM.WA_V1,
      external: {
        log_id: LOG_ID,
        userId: USER_ID,
        conversation_id: CONVERSATION_ID,
        request_text: REQUEST_TEXT,
        response: RESPONSE_TEXT,
        intent: TOP_INTENT.intent,
        intent_confidence: TOP_INTENT.confidence,
        entity: TOP_ENTITY.entity,
        entity_confidence: TOP_ENTITY.confidence,
        nodes_visited: VISITED_NODES,
        request_date: splitDate(external.request_timestamp),
        request_time: splitTime(external.request_timestamp),
        response_date: splitDate(external.response_timestamp),
        response_time: splitTime(external.response_timestamp),
      }
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_flattenLogForWaV1.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const _flattenLogs = async (
  logs: Array<IAiLogRecordV1>,
) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(logs) &&
    lodash.isArray(logs)
  ) {
    for (const LOG of logs) {
      const TYPE = LOG?.type;
      switch (TYPE) {
        case AI_SERVICE_TYPE_ENUM.WA_V1:
          RET_VAL.push(_flattenLogForWaV1(LOG));
          break;
        default:
          break;
      }
    }
  }
  return RET_VAL;
}

export const retrieveManyByQueryFlatten = async (
  context: IContextV1,
  params: {
    aiServiceId: any,
    query: {
      filter: {
        aiSkill: IAiSkillV1,
      },
    },
  },
) => {
  try {
    const RESPONSE = await retrieveManyByQuery(context, params);
    const FLATTEN_LOGS = await _flattenLogs(RESPONSE?.items);
    const RET_VAL = {
      items: FLATTEN_LOGS,
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(retrieveManyByQueryFlatten.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

