/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
 * This is an abstract class definition
 * with methods to be implemented by each actual
 * data store implementation
 */
const MODULE_ID = 'aca-search-and-analysis-service-datasource-provider-abstract-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const EventEmitter = require('events');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
class AcaAiSearchAndAnalysisServicesDatasource extends EventEmitter {

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
      logger.error('constructor', { ACA_ERROR });
      throw ACA_ERROR;
    }
  }

  get aiSearchAndAnalysisServices() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
      createOne: async (context, params) => { },
      updateOne: async (context, params) => { },
      deleteOneById: async (context, params) => { },
    };
    return RET_VAL;
  }
}

module.exports = {
  AcaAiSearchAndAnalysisServicesDatasource
};
