/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-client-provider-client-wa-v1-ai-skills-save-one-sanitize-one-for-create';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IAiSkillExternalV1WaV1,
} from '@ibm-aiap/aiap--types-server';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  AssistantV1,
} from '@ibm-aiap/aiap-wrapper-ibm-watson';

import {
  ISaveAiSkillParamsV1,
} from '../../../types';


const sanitizeOneForCreate = (
  params: ISaveAiSkillParamsV1,
) => {
  let external: IAiSkillExternalV1WaV1;
  try {
    external = params?.value?.external as IAiSkillExternalV1WaV1;

    const RET_VAL: AssistantV1.CreateWorkspaceParams = {};
    if (
      !lodash.isEmpty(external?.name)
    ) {
      RET_VAL.name = external?.name;
    }
    if (
      !lodash.isEmpty(external?.description)
    ) {
      RET_VAL.description = external?.description;
    }
    if (
      !lodash.isEmpty(external?.language)
    ) {
      RET_VAL.language = external?.language;
    }
    if (
      !lodash.isEmpty(external?.dialog_nodes)
    ) {
      RET_VAL.dialogNodes = external?.dialog_nodes;
    }
    if (
      !lodash.isEmpty(external?.counterexamples)
    ) {
      RET_VAL.counterexamples = external?.counterexamples;
    }
    if (
      !lodash.isEmpty(external?.metadata)
    ) {
      RET_VAL.metadata = external?.metadata;
    }
    if (
      lodash.isBoolean(external?.learning_opt_out)
    ) {
      RET_VAL.learningOptOut = external?.learning_opt_out;
    }
    if (
      !lodash.isEmpty(external?.system_settings)
    ) {
      RET_VAL.systemSettings = external?.system_settings;
    }
    if (
      !lodash.isEmpty(external?.webhooks)
    ) {
      RET_VAL.webhooks = external?.webhooks;
    }
    if (
      !lodash.isEmpty(external?.intents)
    ) {
      RET_VAL.intents = external?.intents;
    }
    if (
      !lodash.isEmpty(external?.entities)
    ) {
      RET_VAL.entities = external?.entities;
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(sanitizeOneForCreate.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  sanitizeOneForCreate,
}
