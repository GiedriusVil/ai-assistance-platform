/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-datasource-mongo'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');


const { formatIntoAcaError, ACA_ERROR_TYPE, throwAcaError } = require('@ibm-aca/aca-utils-errors');
const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');
const { createIndex } = require('@ibm-aiap/aiap-utils-mongo');

const { AcaOrganizationsDatasource } = require('../datasource');
const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _organizations = require('./organizations');
const _organizationsImport = require('./organizations-import');
const _organizationsReleases = require('./organizations-releases');

class AcaOrganizationsDatasourceMongo extends AcaOrganizationsDatasource {

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

  async _getClient() {
    const RET_VAL = await this.acaMongoClient.getClient();
    return RET_VAL;
  }

  async _getDB() {
    const RET_VAL = await this.acaMongoClient.getDB();
    return RET_VAL;
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

  async initialize() {
    if (
      this.configuration.defaultOrganizationsEnabled
    ) {
      const DB = this._getDB();
      _organizations.ensureDefaultOrganizations(DB, this._collections);
    }

    await this._ensureIndexes();
  }

  get organizations() {
    return {
      findManyByQuery: async (context, params) => {
        return _organizations.findManyByQuery(this, context, params);
      },
      findManyLiteByQuery: async (context, params) => {
        return _organizations.findManyLiteByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _organizations.findOneById(this, context, params);
      },
      findOneByExternalId: async (context, params) => {
        return _organizations.findOneByExternalId(this, context, params);
      },
      saveOne: async (context, params) => {
        return _organizations.saveOne(this, context, params);
      },
      deleteOneById: async (context, params) => {
        return _organizations.deleteOneById(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _organizations.deleteManyByIds(this, context, params);
      },
    };
  }

  get organizationsImport() {
    return {
      findManyByQuery: async (context, params) => {
        return _organizationsImport.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _organizationsImport.findOneById(this, context, params);
      },
      saveOne: async (context, params) => {
        return _organizationsImport.saveOne(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _organizationsImport.deleteManyByIds(this, context, params);
      },
    };
  }

  get organizationsReleases() {
    const RET_VAL = {
      saveOne: async (context, params) => {
        return _organizationsReleases.saveOne(this, context, params);
      },
    };
    return RET_VAL;
  }
    
  async _ensureIndexes() {
    try {
      const DB = await this._getDB();
      const COLLECTIONS = this._collections;
      await createIndex(DB, COLLECTIONS.organizations, { name: 1 }, { unique: true });
      await createIndex(DB, COLLECTIONS.organizations, { 'external.id': 1 }, { unique: true });
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ACA_ERROR.configuration = this.configuration;
      logger.error(this._ensureIndexes.name, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

}

module.exports = {
  AcaOrganizationsDatasourceMongo,
};
