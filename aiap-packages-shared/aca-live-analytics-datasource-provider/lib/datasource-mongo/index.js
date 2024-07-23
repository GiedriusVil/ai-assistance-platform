/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-datasource-mongo';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, appendDataToError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');

const { AcaLiveAnalyticsDatasource } = require('../datasource');

const { sanitizedCollectionsFromConfiguration } = require('./collections.utils');

const _dashboards = require('./dashboards');
const _charts = require('./charts');
const _queries = require('./queries');
const _tiles = require('./tiles');
const _filters = require('./filters');
const _dashboardsModelChanges = require('./dashboards-model-changes');
const _chartsModelChanges = require('./charts-model-changes');
const _queriesModelChanges = require('./queries-model-changes');
const _tilesModelChanges = require('./tiles-model-changes');
const _filtersModelChanges = require('./filters-model-changes');

class AcaLiveAnalyticsDatasourceMongo extends AcaLiveAnalyticsDatasource {

  constructor(configuration) {
    super(configuration);
    try {
      this._collections = sanitizedCollectionsFromConfiguration(this.configuration);

      const ACA_MONGO_CLIENT_ID = this.configuration?.client;
      const ACA_MONGO_CLIENT_HASH = this.configuration?.clientHash;

      this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);

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

  async _getAcaMongoClient() {
    let retVal;
    try {
      retVal = this.acaMongoClient;
      if (
        lodash.isEmpty(retVal)
      ) {
        const ACA_MONGO_CLIENT_ID = this.configuration?.client;
        const ACA_MONGO_CLIENT_HASH = this.configuration?.clientHash;
        this.acaMongoClient = getAcaMongoClient(ACA_MONGO_CLIENT_ID, ACA_MONGO_CLIENT_HASH);
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

  async initialize() { }

  get charts() {
    return {
      saveOne: async (context, params) => {
        return _charts.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _charts.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _charts.findOneById(this, context, params);
      },
      findOneByRef: async (context, params) => {
        return _charts.findOneByRef(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _charts.deleteManyByIds(this, context, params);
      },
    };
  }

  get chartsModelChanges() {
    return {
      saveOne: async (context, params) => {
        return _chartsModelChanges.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _chartsModelChanges.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _chartsModelChanges.findOneById(this, context, params);
      },
    };
  }

  get dashboards() {
    return {
      saveOne: async (context, params) => {
        return _dashboards.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _dashboards.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _dashboards.findOneById(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _dashboards.deleteManyByIds(this, context, params);
      },
    };
  }

  get dashboardsModelChanges() {
    return {
      saveOne: async (context, params) => {
        return _dashboardsModelChanges.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _dashboardsModelChanges.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _dashboardsModelChanges.findOneById(this, context, params);
      },
    };
  }

  get queries() {
    return {
      saveOne: async (context, params) => {
        return _queries.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _queries.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _queries.findOneById(this, context, params);
      },
      findOneByRef: async (context, params) => {
        return _queries.findOneByRef(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _queries.deleteManyByIds(this, context, params);
      },
    };
  }

  get queriesModelChanges() {
    return {
      saveOne: async (context, params) => {
        return _queriesModelChanges.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _queriesModelChanges.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _queriesModelChanges.findOneById(this, context, params);
      },
    };
  }

  get filters() {
    return {
      saveOne: async (context, params) => {
        return _filters.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _filters.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _filters.findOneById(this, context, params);
      },
      findOneByRef: async (context, params) => {
        return _filters.findOneByRef(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _filters.deleteManyByIds(this, context, params);
      },
    };
  }

  get filtersModelChanges() {
    return {
      saveOne: async (context, params) => {
        return _filtersModelChanges.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _filtersModelChanges.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _filtersModelChanges.findOneById(this, context, params);
      },
    };
  }

  get tiles() {
    return {
      saveOne: async (context, params) => {
        return _tiles.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _tiles.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _tiles.findOneById(this, context, params);
      },
      findOneByRef: async (context, params) => {
        return _tiles.findOneByRef(this, context, params);
      },
      deleteManyByIds: async (context, params) => {
        return _tiles.deleteManyByIds(this, context, params);
      },
    };
  }

  get tilesModelChanges() {
    return {
      saveOne: async (context, params) => {
        return _tilesModelChanges.saveOne(this, context, params);
      },
      findManyByQuery: async (context, params) => {
        return _tilesModelChanges.findManyByQuery(this, context, params);
      },
      findOneById: async (context, params) => {
        return _tilesModelChanges.findOneById(this, context, params);
      },
    };
  }
}

module.exports = {
  AcaLiveAnalyticsDatasourceMongo,
};
