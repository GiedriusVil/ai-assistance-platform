/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
 * This is an abstract class definition
 * with methods to be implemented by each actual
 * data store implementation
 */
const MODULE_ID = 'aca-rules-datasource-provider-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const EventEmitter = require('events');

class AcaRulesDatasource extends EventEmitter {

  constructor(configuration) {
    super();
    this.configuration = configuration;
    this.id = ramda.path(['id'], this.configuration);
    this.name = ramda.path(['name'], this.configuration);
    this.hash = ramda.path(['hash'], this.configuration);
    this.type = ramda.path(['type'], this.configuration);
  }

  get rules() {
    const RET_VAL = {
      findManyByQuery: (context, params) => {},
      findOneById: (context, params) => {},
      saveOne: (context, params) => {},
      deleteOneById: (context, params) => {},
    };
    return RET_VAL;
  }

  get rulesReleases() {
    const RET_VAL = {
      saveOne: (context, params) => {},
    };
    return RET_VAL;
  }

  get rulesImport() {
    const RET_VAL = {
      findManyByQuery: (context, params) => {},
      findOneById: (context, params) => {},
      saveOne: (context, params) => {},
      deleteOneById: (context, params) => {},
      deleteMany: (context, params) => {},
    };
    return RET_VAL;
  }

}

module.exports = {
  AcaRulesDatasource
};
