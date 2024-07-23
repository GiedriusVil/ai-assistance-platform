/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
 * This is an abstract class definition
 * with methods to be implemented by each actual
 * data store implementation
 */
const MODULE_ID = 'aca-jobs-queues-datasource-provider-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');
const EventEmitter = require('events');

class AcaJobsQueuesDatasource extends EventEmitter {

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
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get jobsQueues() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      findManyByMatch: async (context, params) => { },
      deleteManyByIds: async (context, params) => { },
      findLiteOneById: async (context, params) => { },
      findOneById: async (context, params) => { },
      saveOne: async (context, params) => { },
    };

    return RET_VAL;
  }
}

module.exports = {
  AcaJobsQueuesDatasource
};
