/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v2-ai-skills-delete-many-by-ids';
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
  IDeleteAiSkillsByIdsParamsV1,
  IDeleteAiSkillsByIdsResponseV1,
} from '../../types';

import {
  deleteOneById,
} from './delete-one-by-id';

import {
  AiServiceClientV1WaV2,
} from '..';


export const deleteManyByIds = async (
  client: AiServiceClientV1WaV2,
  context: IContextV1,
  params: IDeleteAiSkillsByIdsParamsV1,
): Promise<IDeleteAiSkillsByIdsResponseV1> => {
  let userId;
  let workspaceId;

  let retVal: IDeleteAiSkillsByIdsResponseV1;
  try {
    userId = context?.user?.id;

    if (
      !lodash.isEmpty(params?.ids) &&
      lodash.isArray(params?.ids)
    ) {
      const PROMISES = [];
      for (const ID of params.ids) {
        PROMISES.push(
          deleteOneById(client, context, { id: ID })
        );
      }
      await Promise.all(PROMISES);
    }
    retVal = {};
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { userId, workspaceId });
    logger.error(deleteManyByIds.name, ACA_ERROR);
    throw ACA_ERROR;
  }
}
