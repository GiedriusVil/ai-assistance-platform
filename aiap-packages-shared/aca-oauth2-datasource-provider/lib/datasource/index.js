/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/*
 * This is an abstract class definition
 * with methods to be implemented by each actual
 * data store implementation
 */
const MODULE_ID = 'aca-oauth2-datasource-provider-datasource';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const EventEmitter = require('events');

class AcaOauth2Datasource extends EventEmitter {

  constructor(configuration) {
    super();
    this.configuration = configuration;
    this.id = this.configuration?.id;
    this.name = this.configuration?.name;
    this.hash = this.configuration?.hash;
    this.type = this.configuration?.type;
  }

  get oauth2TokensRefresh() {
    const RET_VAL = {
      saveOne: (context, params) => { },
    };
    return RET_VAL;
  }

}

module.exports = {
  AcaOauth2Datasource,
};
