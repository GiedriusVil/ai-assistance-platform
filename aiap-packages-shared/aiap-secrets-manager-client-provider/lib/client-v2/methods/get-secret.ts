/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-ibm-secrets-manager-client-provider-client-v2-get-secret`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import IbmCloudSecretsManagerClient from '@ibm-cloud/secrets-manager/secrets-manager/v2';
import { SecretManagerV2GetSecretParams } from '..';

const _getSecret = async (
  client: IbmCloudSecretsManagerClient,
  context,
  params: SecretManagerV2GetSecretParams
) => {

  const SECRET_ID = params?.secret?.id;

  let retVal;

  try {
    if (lodash.isEmpty(SECRET_ID)) {
      const MESSAGE = 'Required parameter secret.id is not provided!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    
    /*
    *  documentation - https://cloud.ibm.com/apidocs/secrets-manager?code=node#get-secret
    **/
    const RESPONSE = await client.getSecret({
      id: SECRET_ID,
    });
    retVal = RESPONSE?.result;
    return retVal;
  } catch (error) {
    const MESSAGE = `Failed to retrieve secret!`;
    logger.error(MESSAGE, { SECRET_ID });
  }
}

const getSecret = (
  client: IbmCloudSecretsManagerClient,
  context,
  params: SecretManagerV2GetSecretParams
) => {
  const RET_VAL = async (bail, attempt) => {
    try {
      const RET_VAL = await _getSecret(client, context, params);
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { attempt });
      logger.error(getSecret.name, { ACA_ERROR });
      if (
        ACA_ERROR?.external?.name !== 'NetworkError'
      ) {
        bail(ACA_ERROR);
      } else {
        throw ACA_ERROR;
      }
    }
  }
  return RET_VAL;
}

export {
    getSecret,
}
