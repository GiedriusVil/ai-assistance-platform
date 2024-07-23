/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-lambda-modules-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { 
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import { 
  getMongoClient, 
  AiapMongoClientV1 
} from '@ibm-aiap/aiap-mongo-client-provider';

import {
  BaseDatasourceMongoV1,
} from '@ibm-aiap/aiap--types-datasource';

import {
  IDatasourceLambdaModulesV1,
  IDatasourceConfigurationLambdaModulesV1,
  IDatasourceLambdaModulesCollectionsV1,
} from '../types';

import { sanitizedCollectionsFromConfiguration } from './collections.utils';

import { _modules } from './modules';
import { _modulesReleases } from './modules-releases';
import { _modulesConfigurations } from './modules-configurations';

class LambdaModulesDatasourceMongoV1 
  extends BaseDatasourceMongoV1<IDatasourceConfigurationLambdaModulesV1>
  implements IDatasourceLambdaModulesV1 {
  
  _collections: IDatasourceLambdaModulesCollectionsV1;
  mongoClient: AiapMongoClientV1;
  mongoClientName: string;

  constructor(configuration: IDatasourceConfigurationLambdaModulesV1) {
    try {
      super(configuration);
      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);
      const ACA_MONGO_CLIENT_ID = this.configuration?.client;
      const ACA_MONGO_CLIENT_HASH = this.configuration?.clientHash;
      this.mongoClient = getMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialize() {
    await this._ensureIndexes();
  }

  async _ensureIndexes() {
    try {
      // 
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ACA_ERROR.configuration = this.configuration;
      logger.error(this._ensureIndexes.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get modules() {
    const RET_VAL = _modules(this);
    return RET_VAL;
  }

  get modulesConfigurations() {
    const RET_VAL = _modulesConfigurations(this);
    return RET_VAL;
  }

  get modulesReleases() {
    const RET_VAL = _modulesReleases(this);
    return RET_VAL;
  }
}

export {
  LambdaModulesDatasourceMongoV1,
};
