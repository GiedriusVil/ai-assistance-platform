/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-ibm-secrets-manager-client-provider-client-v1-list-all-secrets`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, appendDataToError } from '@ibm-aca/aca-utils-errors';

import IbmCloudSecretsManagerClient from '@ibm-cloud/secrets-manager/secrets-manager/v1';
import { SecretManagerV1ListSecretsParams } from '..';

const _listAllSecrets = async (
  client: IbmCloudSecretsManagerClient,
  context,
  params: SecretManagerV1ListSecretsParams,
) => {
  const PARAMS = {
    limit: params?.limit || 5000,
    offset: params?.offset || 0,
    search: params?.search,
    sortBy: params?.sortBy || 'creation_date',
    groups: params?.groups,
  };

  try {
    /*
    *  documentation - https://cloud.ibm.com/apidocs/secrets-manager?code=node#list-all-secrets
    **/
    const RET_VAL = await client.listAllSecrets(PARAMS);

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      PARAMS,
    });
    logger.error('_listAllSecrets', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const listAllSecrets = (
  client: IbmCloudSecretsManagerClient,
  context,
  params: SecretManagerV1ListSecretsParams,
) => {
  const RET_VAL = async (bail, attempt) => {
    try {
      const RESPONSE = await _listAllSecrets(client, context, params);
      const RET_VAL = RESPONSE?.result?.resources;
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { attempt });
      logger.error(listAllSecrets.name, { ACA_ERROR });
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
  listAllSecrets,
}
