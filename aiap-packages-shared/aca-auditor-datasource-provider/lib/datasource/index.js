/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
 * This is an abstract class definition
 * with methods to be implemented by each actual
 * data store implementation
 */
const MODULE_ID = 'aca-auditor-datasource-provider-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const EventEmitter = require('events');

class AcaAuditorDatasource extends EventEmitter {

  constructor(configuration) {
    try {
      super();
      this.configuration = configuration;
      this.id = this.configuration?.id;
      this.name = this.configuration?.name;
      this.hash = this.configuration?.hash;
      this.type = this.configuration?.type;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get purchaseRequests() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
      saveOne: async (context, params) => { },
      deleteOneById: async (context, params) => { },
    };
    return RET_VAL;
  }

  get rules() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
      saveOne: async (context, params) => { },
      deleteOneById: async (context, params) => { },
    };
    return RET_VAL;
  }

  get messages() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
      saveOne: async (context, params) => { },
      deleteOneById: async (context, params) => { },
    };
    return RET_VAL;
  }

  get lambdaModules() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
      saveOne: async (context, params) => { },
      deleteOneById: async (context, params) => { },
    };
    return RET_VAL;
  }

  get lambdaModulesErrors() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
      saveOne: async (context, params) => { },
      deleteOneById: async (context, params) => { },
    };
    return RET_VAL;
  }
}

module.exports = {
  AcaAuditorDatasource,
};
