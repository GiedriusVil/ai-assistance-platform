/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'secrets-manager-adapter-provider-adapter-ibm-cloud-secrets-manager-v1-set-secret-key-values';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import mustache from '@ibm-aca/aca-wrapper-mustache';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getSecretsManagerClient,
} from '@ibm-aiap/aiap-ibm-secrets-manager-client-provider';

const _getKeyValues = (
  secrets: Array<any>
) => {
  const RET_VAL = {};
  secrets?.forEach(secret => {
    const PAYLOAD = secret?.secret_data?.payload ?? secret?.data;
    lodash.merge(RET_VAL, PAYLOAD);
  });
  logger.info(_getKeyValues.name, { keys: Object.keys(RET_VAL) });
  return RET_VAL;
}

const _getSecrets = async (
  clientName: any,
) => {
  let retVal = [];

  const SECRETS_MANAGER_CLIENT = getSecretsManagerClient(clientName);
  if (!lodash.isEmpty(SECRETS_MANAGER_CLIENT)) {
    const ALL_GROUP_SECRETS = await SECRETS_MANAGER_CLIENT?.listAllSecrets({}, { groups: process.env.AIAP_SECRETS_MANAGER_GROUP_ID });
    const PROMISES = [];
    ALL_GROUP_SECRETS?.forEach(secret => {
      const SECRET_ID = secret?.id;
      const SECRET_TYPE = secret?.secret_type;

      if (!lodash.isEmpty(SECRET_ID)) {
        const CONTEXT = {};
        const PARAMS = {
          secret: {
            id: SECRET_ID,
            type: SECRET_TYPE,
          },
        };
        PROMISES.push(SECRETS_MANAGER_CLIENT.getSecret(CONTEXT, PARAMS));
      }
    });
    retVal = await Promise.all(PROMISES);
  }
  return retVal;
}

const _mapKeyValuesToConfiguration = (
  configuration: any,
  keyValues: any,
) => {
  const RET_VAL = JSON.parse(mustache.render(JSON.stringify(configuration), keyValues));
  return RET_VAL;
}

export const setSecretKeyValues = async (
  configuration: any,
  clientName: any,
) => {
  try {
    if (
      lodash.isEmpty(configuration)
    ) {
      const MESSAGE = 'Required parameter configuration is missing!'
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const SECRETS = await _getSecrets(clientName);
    const KEY_VALUES = _getKeyValues(SECRETS);
    const RET_VAL = _mapKeyValuesToConfiguration(configuration, KEY_VALUES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(setSecretKeyValues.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
