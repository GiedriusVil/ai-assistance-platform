/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
/* eslint no-unused-vars: "off" */
const MODULE_ID = 'aca-rules-engine-provider-rule-engine';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');


class AcaRuleEngine {

  constructor() {}

  initialize() {}

  get engine() {
    const RET_VAL = {};
    return RET_VAL;
  }

  get requisition() {
    const RET_VAL = {
      validate: (context, params) => {},
    };
    return RET_VAL;
  }
  
  static STATUS = {
    ONLINE:'online', 
    OFFLINE: 'offline'
  }

}

module.exports = {
  AcaRuleEngine
};
