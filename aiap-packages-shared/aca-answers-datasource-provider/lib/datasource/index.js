/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
 * This is an abstract class definition
 * with methods to be implemented by each actual
 * data store implementation
 */
const MODULE_ID = 'aca-answers-datasource-provider-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError, appendDataToError } = require('@ibm-aca/aca-utils-errors');
const EventEmitter = require('events');

class AcaAnswersDatasource extends EventEmitter {

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

  get answerStoreReleases() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      saveOne: async (context, params) => { },
      deleteOne: async (context, params) => { },
    };
    return RET_VAL;
  }

  get answerStores() {
    const RET_VAL = {
      findManyByQuery: async (context, params) => { },
      findOneById: async (context, params) => { },
      saveOne: async (context, params) => { },
      deleteOne: async (context, params) => { },
    };
    return RET_VAL;
  }

  get answers() {
    const RET_VAL = {

    };
    return RET_VAL;
  }

  get _answers() {
    const RET_VAL = {
      createMany: () => { },
      createOne: () => { },
      exportJson: () => { },
      findAll: () => { },
      findOne: () => { },
      removeOne: () => { },
      saveMany: () => { },
      updateOne: () => { },
    };
    return RET_VAL;
  }

  get _answersReleases() {
    const RET_VAL = {
      createOne: () => { },
      findAll: () => { },
      findOne: () => { },
    };
    return RET_VAL;
  }
}

module.exports = {
  AcaAnswersDatasource
};
