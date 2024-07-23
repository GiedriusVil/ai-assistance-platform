/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-ai-services-change-request-delete-many-by-ids';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  getAiServicesDatasourceByContext,
  getAcaConversationsDatasourceByContext
} from '../utils/datasource-utils';



export const deleteManyByIds = async (
  context: IContextV1,
  params: {
    ids: Array<any>,
  },
) => {
  try {
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    const RET_VAL = await DATASOURCE.aiServicesChangeRequest.deleteManyByIds(context, params);
    const CONVERSATIONS_DATASOURCE = getAcaConversationsDatasourceByContext(context);
    const UTTERANCES_WITH_AI_CHANGE_REQUEST_IDS = await CONVERSATIONS_DATASOURCE.utterances.findManyByAiChangeRequestIds(context, params);
    if (
      !lodash.isEmpty(UTTERANCES_WITH_AI_CHANGE_REQUEST_IDS)
    ) {
      const PROMISES = [];
      UTTERANCES_WITH_AI_CHANGE_REQUEST_IDS.forEach(utterance => {
        delete utterance.aiChangeRequest;
        const SAVE_ONE_PARAMS = {
          utterance: utterance,
          conditions: {
            unset: {
              aiChangeRequest: ""
            }
          }
        }
        PROMISES.push(
          CONVERSATIONS_DATASOURCE.utterances.saveOne(context, SAVE_ONE_PARAMS)
        )
      })
      await Promise.all(PROMISES);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(deleteManyByIds.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};
