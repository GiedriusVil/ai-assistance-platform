/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap--types-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  throwAcaError,
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  getMongoClient,
  AiapMongoClientV1,
} from '@ibm-aiap/aiap-mongo-client-provider';

import {
  BaseDatasourceV1,
} from './base-datasource-v1';

import {
  IDatasourceConfigurationV1,
} from '../configuration';

abstract class BaseDatasourceMongoV1<EConfiguration extends IDatasourceConfigurationV1> extends BaseDatasourceV1<EConfiguration> {

  acaMongoClient: AiapMongoClientV1;

  constructor(
    configuration: EConfiguration,
  ) {
    super(configuration);
    try {
      const MONGO_CLIENT_ID = this.configuration.client;
      const MONGO_CLIENT_HASH = this.configuration.clientHash;

      this.acaMongoClient = getMongoClient(MONGO_CLIENT_ID, MONGO_CLIENT_HASH);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration })
      logger.error('constructor', { ACA_ERROR });
    }
  }

  async _getClient() {
    const RET_VAL = await this.acaMongoClient.getClient();
    return RET_VAL;
  }

  async _getDB() {
    const RET_VAL = await this.acaMongoClient.getDB();
    return RET_VAL;
  }

  /**
   * 
   * @deprecated -> use _getMongoClient 
   */
  async _getAcaMongoClient(): Promise<AiapMongoClientV1> {
    const RET_VAL = await this._getMongoClient();
    return RET_VAL;
  }

  async _getMongoClient(): Promise<AiapMongoClientV1> {
    let retVal;
    try {
      retVal = this.acaMongoClient;
      if (
        lodash.isEmpty(retVal)
      ) {
        const MONGO_CLIENT_ID = this.configuration.client;
        const MONGO_CLIENT_HASH = this.configuration.clientHash;
        this.acaMongoClient = getMongoClient(MONGO_CLIENT_ID, MONGO_CLIENT_HASH);
        retVal = this.acaMongoClient;
      }
      if (
        lodash.isEmpty(retVal)
      ) {
        const MESSAGE = `Unable to retrieve MongoClientV1!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this._getMongoClient.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialize() {
    await this._ensureIndexes();
  }

  abstract _ensureIndexes(): Promise<void>;
}

export {
  BaseDatasourceMongoV1,
}
