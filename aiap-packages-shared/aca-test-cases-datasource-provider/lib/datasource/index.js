/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

/*
 * This is an abstract class definition
 * with methods to be implemented by each actual
 * data store implementation
 */
const MODULE_ID = 'aca-test-cases-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const EventEmitter = require('events');

class AcaTestCasesDatasource extends EventEmitter {

  constructor(configuration) {
    try {
      super();
      this.configuration = configuration;
      this.id = ramda.path(['id'], this.configuration);
      this.name = ramda.path(['name'], this.configuration);
      this.hash = ramda.path(['hash'], this.configuration);
      this.type = ramda.path(['type'], this.configuration);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration });
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }


  async initialize() { }

  get configurations() {
    const RET_VAL = {
      saveOne: (context, params) => { },
      findMany: (context, params) => { },
      findManyByQuery: (context, params) => { },
      findOneById: (context, params) => { },
      deleteManyByIds: (context, params) => { },
    };

    return RET_VAL;
  }

  get cases() {
    const RET_VAL = {
      saveOne: (context, params) => { },
      findMany: (context, params) => { },
      findManyByQuery: (context, params) => { },
      findOneById: (context, params) => { },
      deleteManyByIds: (context, params) => { },
    };

    return RET_VAL;
  }

  get executions() {
    const RET_VAL = {
      saveOne: (context, params) => { },
      findManyByQuery: (context, params) => { },
      findOneById: (context, params) => { },
      deleteManyByIds: (context, params) => { },
    };

    return RET_VAL;
  }
}

module.exports = {
  AcaTestCasesDatasource,
};
