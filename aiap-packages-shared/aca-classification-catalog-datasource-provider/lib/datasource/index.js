/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
 * This is an abstract class definition
 * with methods to be implemented by each actual
 * data store implementation
 */
const MODULE_ID = 'aca-classification-catalog-datasource-provider-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const EventEmitter = require('events');

class AcaClassificationCatalogDatasource extends EventEmitter {

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

  get segments() {
    const RET_VAL = {
      saveOne: async (context, params) => { },
      findOneById: async (context, params) => { },
      saveVector: async (context, params) => { },
    };
    return RET_VAL;
  }

  get families() {
    const RET_VAL = {
      saveVector: async (context, params) => { },
    };
    return RET_VAL;
  }

  get classes() {
    const RET_VAL = {
      saveVector: async (context, params) => { },
    };

    return RET_VAL;
  }

  get subClasses() {
    const RET_VAL = {
      saveVector: async (context, params) => { },
    };

    return RET_VAL;
  }

  get catalogs() {
    const RET_VAL = {
      saveVector: async (context, params) => { },
    };

    return RET_VAL;
  }

  get vectors() {
    const RET_VAL = {
      saveOne: async (context, params) => { },
      findOneById: async (context, params) => { },
      findManyByQuery: async (context, params) => { },
    }

    return RET_VAL;
  }

  get actions() {
    const RET_VAL = {
      saveOne: async (context, params) => { },
      findOneAndModify: async (context, params) => { },
    };
    return RET_VAL;
  }

  get releases() {
    const RET_VAL = {};
    return RET_VAL;
  }

}

module.exports = {
  AcaClassificationCatalogDatasource
};
