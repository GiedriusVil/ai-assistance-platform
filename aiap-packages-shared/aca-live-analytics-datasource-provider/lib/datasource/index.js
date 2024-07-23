/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-live-analytics-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const EventEmitter = require('events');

class AcaLiveAnalyticsDatasource extends EventEmitter {

  constructor(configuration) {
    super();
    try {
      this.configuration = configuration;
      this.id = this.configuration?.id;
      this.name = this.configuration?.name;
      this.hash = this.configuration?.hash;
      this.type = this.configuration?.type;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(ACA_ERROR, { this_configuration: this.configuration });
    }
  }

  async initialize() { }

  get charts() {
    const RET_VAL = {
      saveOne: async (context, params) => { },
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
      findOneByRef: async (context, params) => { },
      deleteManyByIds: async (context, params) => { },
    };
    return RET_VAL;
  }

  get chartsModelChanges() {
    const RET_VAL = {
      saveOne: async (context, params) => { },
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
    };
    return RET_VAL;
  }

  get dashboards() {
    const RET_VAL = {
      saveOne: async (context, params) => { },
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
      deleteManyByIds: async (context, params) => { },
    };
    return RET_VAL;
  }

  get dashboardsModelChanges() {
    const RET_VAL = {
      saveOne: async (context, params) => { },
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
    };
    return RET_VAL;
  }
  
  get queries() {
    const RET_VAL = {
      saveOne: async (context, params) => { },
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
      findOneByref: async (context, params) => { },
      deleteManyByIds: async (context, params) => { },
    };
    return RET_VAL;
  }

  get queriesModelChanges() {
    const RET_VAL = {
      saveOne: async (context, params) => { },
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
    };
    return RET_VAL;
  }

  get tiles() {
    const RET_VAL = {
      saveOne: async (context, params) => { },
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
      findOneByref: async (context, params) => { },
      deleteManyByIds: async (context, params) => { },
    };
    return RET_VAL;
  }

  get tilesModelChanges() {
    const RET_VAL = {
      saveOne: async (context, params) => { },
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
    };
    return RET_VAL;
  }
}

module.exports = {
  AcaLiveAnalyticsDatasource,
};
