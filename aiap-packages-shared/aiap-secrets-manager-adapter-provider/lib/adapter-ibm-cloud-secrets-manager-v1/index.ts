/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'secrets-manager-adapter-provider-ibm-cloud-secrets-manager-adapter-v1';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  SecretsManagerAdapterV1,
} from '../adapter';

import * as _secrets from './secrets';

export class SecretsManagerAdapterV1IbmCloud extends SecretsManagerAdapterV1 {

  constructor() {
    super();
  }

  get secrets() {
    const RET_VAL = {
      setSecretKeyValues: async (context, params) => {
        return _secrets.setSecretKeyValues(context, params);
      },
    };
    return RET_VAL;
  }

  initAdapterClientProviderByConfigurationProvider = async (
    provider: any,
  ) => {
    try {
      if (
        lodash.isEmpty(provider)
      ) {
        const ERROR_MESSAGE = 'Required parameter configurationProvider is missing!'
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
      }
      await require('@ibm-aiap/aiap-ibm-secrets-manager-client-provider').initByConfigurationProvider(provider);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.initAdapterClientProviderByConfigurationProvider.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

