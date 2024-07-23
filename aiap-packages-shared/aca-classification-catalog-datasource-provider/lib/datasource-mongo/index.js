/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');

const { AcaClassificationCatalogDatasource } = require('../datasource');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');
const { createIndex } = require('@ibm-aiap/aiap-utils-mongo')

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _catalogs = require('./catalogs');
const _segments = require('./segments');
const _families = require('./families');
const _classes = require('./classes');
const _subClasses = require('./sub-classes');
const _actions = require('./actions');
const _vectors = require('./vectors');

class AcaClassificationCatalogDatasourceMongo extends AcaClassificationCatalogDatasource {

  constructor(configuration) {
    try {
      super(configuration);

      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);

      const ACA_MONGO_CLIENT_ID = this.configuration?.client;
      const ACA_MONGO_CLIENT_HASH = this.configuration?.clientHash;

      this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async _getAcaMongoClient() {
    let retVal;
    try {
      retVal = this.acaMongoClient;
      if (
        lodash.isEmpty(retVal)
      ) {
        this.acaMongoClient = getAcaMongoClient(this.mongoClientName);
        retVal = this.acaMongoClient;
      }
      if (
        lodash.isEmpty(retVal)
      ) {
        const MESSAGE = `Unable to retrieve AcaMongoClient!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      return retVal;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_getAcaMongoClient', { ACA_ERROR });
      throw ACA_ERROR;
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

  async initialize() {
    await this._ensureIndexes();
  }

  async _ensureIndexes() {
    try {
      const DB = await this._getDB();
      const COLLECTIONS = this._collections;
      const LANGUAGE = 'en';
      const FIELD = {
        SEGMENT: `segments.titleCanonical.${LANGUAGE}`,
        FAMILY: `families.titleCanonical.${LANGUAGE}`,
        CLASS: `classes.titleCanonical.${LANGUAGE}`,
        SUB_CLASS: `subClasses.titleCanonical.${LANGUAGE}`,
        ACTIONS: `actions.titleCanonical.${LANGUAGE}`,
      };
      await createIndex(DB, COLLECTIONS.segments, { [FIELD.SEGMENT]: 1 });
      await createIndex(DB, COLLECTIONS.families, { [FIELD.FAMILY]: 1 });
      await createIndex(DB, COLLECTIONS.classes, { [FIELD.CLASS]: 1 });
      await createIndex(DB, COLLECTIONS.subClasses, { [FIELD.SUB_CLASS]: 1 });
      await createIndex(DB, COLLECTIONS.actions, { [FIELD.ACTIONS]: 1 });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('_ensureIndexes', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get actions() {
    const RET_VAL = {
      saveOne: async (context, params) => {
        return _actions.saveOne(this, context, params);
      },
      findOneAndModify: async (context, params) => {
        return _actions.findOneAndModify(this, context, params);
      }
    };
    return RET_VAL;
  }

  get catalogs() {
    const RET_VAL = {
      findManyByMatch: async (context, params) => {
        return _catalogs.findManyByMatch(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _catalogs.findManyByQuery(this, context, params);
      },
      //
      deleteManyByIds: async (context, params) => {
        return _catalogs.deleteManyByIds(this, context, params);
      },
      findLiteOneById: async (context, params) => {
        return _catalogs.findLiteOneById(this, context, params);
      },
      findOneById: async (context, params) => {
        return _catalogs.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _catalogs.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }

  get classes() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _classes.findManyByQuery(this, context, params);
      },
      //
      deleteManyByCatalogId: async (context, params) => {
        return _classes.deleteManyByCatalogId(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _classes.deleteManyByIds(this, context, params);
      },
      findLiteOneById: async (context, params) => {
        return _classes.findLiteOneById(this, context, params);
      },
      findOneById: async (context, params) => {
        return _classes.findOneById(this, context, params);
      },
      saveMany: async (context, params) => {
        return _classes.saveMany(this, context, params);
      },
      saveOne: async (context, params) => {
        return _classes.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }

  get segments() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _segments.findManyByQuery(this, context, params);
      },
      //
      deleteManyByCatalogId: async (context, params) => {
        return _segments.deleteManyByCatalogId(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _segments.deleteManyByIds(this, context, params);
      },
      findLiteOneById: async (context, params) => {
        return _segments.findLiteOneById(this, context, params);
      },
      findOneById: async (context, params) => {
        return _segments.findOneById(this, context, params);
      },
      saveMany: async (context, params) => {
        return _segments.saveMany(this, context, params);
      },
      saveOne: async (context, params) => {
        return _segments.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }

  get families() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _families.findManyByQuery(this, context, params);
      },
      //
      deleteManyByCatalogId: async (context, params) => {
        return _families.deleteManyByCatalogId(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _families.deleteManyByIds(this, context, params);
      },
      findLiteOneById: async (context, params) => {
        return _families.findLiteOneById(this, context, params);
      },
      findOneById: async (context, params) => {
        return _families.findOneById(this, context, params);
      },
      saveMany: async (context, params) => {
        return _families.saveMany(this, context, params);
      },
      saveOne: async (context, params) => {
        return _families.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }

  get subClasses() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => {
        return _subClasses.findManyByQuery(this, context, params);
      },
      //
      deleteManyByCatalogId: async (context, params) => {
        return _subClasses.deleteManyByCatalogId(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _subClasses.deleteManyByIds(this, context, params);
      },
      findLiteOneById: async (context, params) => {
        return _subClasses.findLiteOneById(this, context, params);
      },
      findOneById: async (context, params) => {
        return _subClasses.findOneById(this, context, params);
      },
      saveMany: async (context, params) => {
        return _subClasses.saveMany(this, context, params);
      },
      saveOne: async (context, params) => {
        return _subClasses.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }

  get vectors() {
    const RET_VAL = {
      saveOne: async (context, params) => {
        return _vectors.saveOne(this, context, params);
      },
      findOneById: async (context, params) => {
        return _vectors.findOneById(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _vectors.findManyByQuery(this, context, params);
      },
    };
    return RET_VAL;
  }

  get releases() {
    const RET_VAL = {};
    return RET_VAL;
  }

}

module.exports = {
  AcaClassificationCatalogDatasourceMongo
};
