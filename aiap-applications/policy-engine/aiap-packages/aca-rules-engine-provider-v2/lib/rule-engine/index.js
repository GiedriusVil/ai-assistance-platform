/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-provider-v2-rule-engine';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

class AcaRuleEngineV2 {

  constructor() { }

  initialize() { }

  get engine() {
    const RET_VAL = {};
    return RET_VAL;
  }

  get document() {
    const RET_VAL = {
      validateOne: (context, params) => { },
      validateMany: (context, params) => { },
    };
    return RET_VAL;
  }

  static STATUS = {
    ONLINE: 'online',
    OFFLINE: 'offline'
  }

}

module.exports = {
  AcaRuleEngineV2,
};
