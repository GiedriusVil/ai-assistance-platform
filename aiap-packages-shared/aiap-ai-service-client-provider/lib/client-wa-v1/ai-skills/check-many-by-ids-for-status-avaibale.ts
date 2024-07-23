/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-skills-check-one-for-status-available';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  appendDataToError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  checkOneByIdForStatusAvailable,
} from './check-one-by-id-for-status-avaibale';

import {
  ICheckAiSkillsByIdsForStatusAvailableParamsV1,
  ICheckAiSkillsByIdsForStatusAvailableResponseV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';

export const checkManyByIdsForStatusAvailable = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: ICheckAiSkillsByIdsForStatusAvailableParamsV1,
): Promise<ICheckAiSkillsByIdsForStatusAvailableResponseV1> => {
  let userId;
  let workspaceId;

  let retVal: ICheckAiSkillsByIdsForStatusAvailableResponseV1;
  try {
    userId = context?.user?.id;

    const PROMISES = [];
    if (
      !lodash.isEmpty(params?.ids) &&
      lodash.isArray(params?.ids)
    ) {
      for (const ID of params.ids) {
        PROMISES.push(
          checkOneByIdForStatusAvailable(client, context, { id: ID }),
        );
      }
    }
    const PROMISE_RESULTS = await Promise.all(PROMISES);
    retVal = {
      value: true,
    };
    for (const PROMISE_RESULT of PROMISE_RESULTS) {
      if (
        !PROMISE_RESULT?.value
      ) {
        retVal.value = false;
        break;
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { userId, workspaceId });
    logger.error(checkManyByIdsForStatusAvailable.name, ACA_ERROR);
    throw ACA_ERROR;
  }
}
