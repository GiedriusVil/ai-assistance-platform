/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
 * This is an abstract class definition
 * with methods to be implemented by each actual
 * data store implementation
 */
const MODULE_ID = 'aca-buy-rules-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const EventEmitter = require('events');
const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');

class AcaBuyRulesDatasource extends EventEmitter {

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
      appendDataToError(ACA_ERROR, { configuration });
      logger.error(`constructor`, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  async initialize() { }

  get rules() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      deleteManyByIds: async (context, params) => { },
      findOneById: async (context, params) => { },
      saveOne: async (context, params) => { },
    };
    return RET_VAL;
  }

  get rulesConditions() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      deleteManyByIds: async (context, params) => { },
      deleteManyByRuleId: async (context, params) => { },
      findOneById: async (context, params) => { },
      saveOne: async (context, params) => { },
    };
    return RET_VAL;
  }

  get rulesSuppliers() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      deleteManyByIds: async (context, params) => { },
      deleteManyByRuleId: async (context, params) => { },
      findOneById: async (context, params) => { },
      saveOne: async (context, params) => { },
    };
    return RET_VAL;
  }

  get rulesAudtis() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      deleteManyByIds: async (context, params) => { },
      deleteOneById: async (context, params) => { },
      findOneById: async (context, params) => { },
      saveOne: async (context, params) => { },
    };
    return RET_VAL;
  }
  
}

module.exports = {
  AcaBuyRulesDatasource,
};
