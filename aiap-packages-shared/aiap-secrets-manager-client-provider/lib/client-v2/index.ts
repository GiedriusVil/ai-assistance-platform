/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aiap-ibm-secrets-manager-client-provider-client';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import IbmCloudSecretsManagerClient from '@ibm-cloud/secrets-manager/secrets-manager/v2';
import { IamAuthenticator } from '@ibm-cloud/secrets-manager/auth';

import {
  retryAsync,
} from '@ibm-aiap/aiap-wrapper-async-retry';

import {
  constructRetryOptions,
} from './options';

import {
  getSecret,
  listAllSecrets,
} from './methods';

import { AIAPIbmSecretsManagerClient } from '../client';
import { SecretManagerV2GetSecretParams, SecretManagerV2ListSecretsParams } from './types';

class AIAPIbmSecretsManagerClientV2 implements AIAPIbmSecretsManagerClient {

  configuration: any;
  name: string;
  options: any;
  client: IbmCloudSecretsManagerClient;

  constructor(configuration) {
    try {
      this.configuration = configuration;
      this.name = this.configuration?.name;
      this.options = this.configuration?.options;
      this.client = undefined;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialize() {
    try {
      const authenticator = new IamAuthenticator({
        apikey: process.env.AIAP_SECRETS_MANAGER_API_KEY,
      });

      this.client = new IbmCloudSecretsManagerClient({
        authenticator,
        serviceUrl: this.options?.url,
      });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.initialize.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async getSecret(context, params: SecretManagerV2GetSecretParams) {
    try {
      const RET_VAL = await retryAsync(
        getSecret(this.client, context, params),
        constructRetryOptions(this, context, params),
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.getSecret.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async listAllSecrets(context, params: SecretManagerV2ListSecretsParams) {
    try {
      const RET_VAL = await retryAsync(
        listAllSecrets(this.client, context, params),
        constructRetryOptions(this, context, params),
      );
      return RET_VAL;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.listAllSecrets.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  AIAPIbmSecretsManagerClientV2,
  SecretManagerV2GetSecretParams,
  SecretManagerV2ListSecretsParams,
};
