/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { 
  formatIntoAcaError, 
  appendDataToError, 
  ACA_ERROR_TYPE, 
  throwAcaError 
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import { 
  AiapMongoClientV1,
  getMongoClient 
} from '@ibm-aiap/aiap-mongo-client-provider';

import { 
  createIndex 
} from '@ibm-aiap/aiap-utils-mongo';

import {
  BaseDatasourceMongoV1,
} from '@ibm-aiap/aiap--types-datasource';

import { 
  IDatasourceAITranslationServicesCollectionsV1,
  IDatasourceConfigurationAITranslationServicesV1, 
  IDatasourceTranslationServicesV1
} from '../types';

import { 
  sanitizedCollectionsFromConfiguration 
} from './collections-utils';

import * as _aiTranslationServices from './ai-translation-services';
import * as _aiTranslationServicesChanges from './ai-translation-services-changes';
import * as _aiTranslationModels from './ai-translation-models';
import * as _aiTranslationModelsChanges from './ai-translation-models-changes';
import * as _aiTranslationModelExamples from './ai-translation-model-examples';
import * as _aiTranslationPrompts from './ai-translation-prompts';

class AiTranslationServicesDatasourceMongoV1
  extends BaseDatasourceMongoV1<IDatasourceConfigurationAITranslationServicesV1>
  implements IDatasourceTranslationServicesV1 {
  
  _collections: IDatasourceAITranslationServicesCollectionsV1;

  constructor(
    configuration: IDatasourceConfigurationAITranslationServicesV1
  ) {
    super(configuration);
    try {
      this.configuration.encryptionKey = 'someKey';
      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);
      
      const MONGO_CLIENT_ID = this.configuration?.client;
      const MONGO_CLIENT_HASH = this.configuration?.clientHash;

      this.mongoClient = getMongoClient(MONGO_CLIENT_ID, MONGO_CLIENT_HASH);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration })
      logger.error('constructor', { ACA_ERROR });
    }
  }

  async _getClient() {
    const RET_VAL = await this.mongoClient.getClient();
    return RET_VAL;
  }

  async _getDB() {
    const RET_VAL = await this.mongoClient.getDB();
    return RET_VAL;
  }

  async _getMongoClient(): Promise<AiapMongoClientV1> {
    let retVal: AiapMongoClientV1;
    try {
      retVal = this.mongoClient;
      if (
        lodash.isEmpty(retVal)
      ) {
        const MONGO_CLIENT_ID = this.configuration?.client;
        const MONGO_CLIENT_HASH = this.configuration?.clientHash;

        this.mongoClient = getMongoClient(MONGO_CLIENT_ID, MONGO_CLIENT_HASH);
        retVal = this.mongoClient;
      }
      if (
        lodash.isEmpty(retVal)
      ) {
        const MESSAGE = `Unable to retrieve MongoClient!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_getMongoClient', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialize() {
    await this._ensureIndexes();
  }

  async _ensureIndexes() {
    try {
      const COLLECTIONS = this._collections;
      const DB = await this._getDB();
      await createIndex(
        DB,
        COLLECTIONS.aiTranslationModels,
        {
          serviceId: 1,
          source: 1,
          target: 1
        },
        {
          unique: true
        }
      );
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ACA_ERROR.configuration = this.configuration;
      logger.error(this._ensureIndexes.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get aiTranslationServices() {
    return {
      findManyByQuery: async (context: IContextV1, params) => {
        return _aiTranslationServices.findManyByQuery(this, context, params);
      },
      findOneById: async (context: IContextV1, params) => {
        return _aiTranslationServices.findOneById(this, context, params);
      },
      saveOne: async (context: IContextV1, params) => {
        return _aiTranslationServices.saveOne(this, context, params);
      },
      deleteManyByIds: async (context: IContextV1, params) => {
        return _aiTranslationServices.deleteManyByIds(this, context, params);
      },
    };
  }

  get aiTranslationServicesChanges() {
    return {
      findManyByQuery: async (context: IContextV1, params) => {
        return _aiTranslationServicesChanges.findManyByQuery(this, context, params);
      },
      findOneById: async (context: IContextV1, params) => {
        return _aiTranslationServicesChanges.findOneById(this, context, params);
      },
      saveOne: async (context: IContextV1, params) => {
        return _aiTranslationServicesChanges.saveOne(this, context, params);
      },
    };
  }

  get aiTranslationModels() {
    return {
      findManyByQuery: async (context: IContextV1, params) => {
        return _aiTranslationModels.findManyByQuery(this, context, params);
      },
      findOneById: async (context: IContextV1, params) => {
        return _aiTranslationModels.findOneById(this, context, params);
      },
      findOneByQuery: async (context: IContextV1, params) => {
        return _aiTranslationModels.findOneByQuery(this, context, params);
      },
      saveOne: async (context: IContextV1, params) => {
        return _aiTranslationModels.saveOne(this, context, params);
      },
      deleteManyByIds: async (context: IContextV1, params) => {
        return _aiTranslationModels.deleteManyByIds(this, context, params);
      },
    };
  }

  get aiTranslationModelsChanges() {
    return {
      findManyByQuery: async (context: IContextV1, params) => {
        return _aiTranslationModelsChanges.findManyByQuery(this, context, params);
      },
      findOneById: async (context: IContextV1, params) => {
        return _aiTranslationModelsChanges.findOneById(this, context, params);
      },
      saveOne: async (context: IContextV1, params) => {
        return _aiTranslationModelsChanges.saveOne(this, context, params);
      },
    };
  }

  get aiTranslationModelExamples() {
    return {
      findManyByQuery: async (context: IContextV1, params) => {
        return _aiTranslationModelExamples.findManyByQuery(this, context, params);
      },
      findOneById: async (context: IContextV1, params) => {
        return _aiTranslationModelExamples.findOneById(this, context, params);
      },
      saveOne: async (context: IContextV1, params) => {
        return _aiTranslationModelExamples.saveOne(this, context, params);
      },
      deleteManyByIds: async (context: IContextV1, params) => {
        return _aiTranslationModelExamples.deleteManyByIds(this, context, params);
      },
    };
  }

  get aiTranslationPrompts() {
    return {
      findManyByQuery: async (context: IContextV1, params) => {
        return _aiTranslationPrompts.findManyByQuery(this, context, params);
      },
      findOneById: async (context: IContextV1, params) => {
        return _aiTranslationPrompts.findOneById(this, context, params);
      },
      findOneByQuery: async (context: IContextV1, params) => {
        return _aiTranslationPrompts.findOneByQuery(this, context, params);
      },
      saveOne: async (context: IContextV1, params) => {
        return _aiTranslationPrompts.saveOne(this, context, params);
      },
      deleteManyByIds: async (context: IContextV1, params) => {
        return _aiTranslationPrompts.deleteManyByIds(this, context, params);
      },
    };
  }
}

export {
  AiTranslationServicesDatasourceMongoV1,
};
