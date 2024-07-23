/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-tenants-generate-api-key';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1GenerateTenantApiKey,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

export const generateApiKey = async (
  context: IContextV1,
  params: IParamsV1GenerateTenantApiKey,
): Promise<string> => {
  const CONTEXT_USER_ID = context?.user?.id;
  const API_KEY_LENGTH = 50;
  try {
    let retVal = '';

    const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const CHARACTERS_LENGTH = CHARACTERS.length;

    for (let i = 0; i < API_KEY_LENGTH; i++) {
      retVal += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS_LENGTH));
    }

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params });
    logger.error(generateApiKey.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
