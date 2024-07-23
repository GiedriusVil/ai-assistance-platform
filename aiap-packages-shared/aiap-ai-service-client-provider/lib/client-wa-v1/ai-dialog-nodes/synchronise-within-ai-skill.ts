/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-dialog-nodes-synchronise-within-ai-skill';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IAiSkillExternalV1WaV1,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  ISynchroniseAiDialogNodesWithinAiSkillParamsV1,
} from '../../types';

import {
  AiServiceClientV1WaV1,
} from '..';

export const synchroniseWithinAiSkill = async (
  client: AiServiceClientV1WaV1,
  context: IContextV1,
  params: ISynchroniseAiDialogNodesWithinAiSkillParamsV1,
) => {
  const CONTEXT_USER_ID = context?.user?.id;

  let external: IAiSkillExternalV1WaV1;
  try {
    if (
      lodash.isEmpty(params?.aiSkill)
    ) {
      const MESSAGE = `Missing required params?.aiSkillId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS = {
      query: {
        filter: {
          aiSkill: params?.aiSkill,
        },
        pagination: {
          page: 1,
          size: 9999,
        }
      }
    };
    const RESPONSE = await client.dialogNodes.retrieveManyByQuery(context, PARAMS);
    external = params.aiSkill?.external as IAiSkillExternalV1WaV1;
    const DIALOG_NODES_EXTERNALS: Array<any> = [];
    if (
      !lodash.isEmpty(RESPONSE?.items) &&
      lodash.isArray(RESPONSE?.items)
    ) {

      for (const DIALOG_NODE of RESPONSE.items) {
        if (
          !lodash.isEmpty(DIALOG_NODE?.external)
        ) {
          DIALOG_NODES_EXTERNALS.push(DIALOG_NODE?.external)
        }
      }
    }
    external.dialog_nodes = DIALOG_NODES_EXTERNALS;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(synchroniseWithinAiSkill.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

