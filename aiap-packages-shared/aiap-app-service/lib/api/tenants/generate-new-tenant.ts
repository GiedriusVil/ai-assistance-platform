/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-tenants-new-tenant';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  uuidv4,
} from '@ibm-aca/aca-wrapper-uuid';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1GenerateNewTenant,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  generateApiKey,
} from './generate-api-key';

const _generateTenant = async (
  context: IContextV1,
) => {
  const ID = uuidv4();
  const RET_VAL = {
    id: ID,
    integration: {
      apiKey: await generateApiKey(context, {}),
      tokenRefresh: {
        secret: `${ID}-token-refresh-secret`,
        expiryLengthMs: 1000 * 60 * 60 * 24,
      },
      tokenAccess: {
        secret: `${ID}-token-access-secret`,
        expiryLengthMs: 1000 * 60 * 5,
      }
    },
    configuration: {
      notifications: {
        error: true,
        info: true,
        success: true,
        warning: true
      }
    }
  };

  return RET_VAL;
}

export const generateNewTenant = async (
  context: IContextV1,
  params: IParamsV1GenerateNewTenant,
) => {
  try {
    const RET_VAL = await _generateTenant(context);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(generateNewTenant.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
