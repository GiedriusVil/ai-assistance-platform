/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { pathsToMask, pathsToMaskMatchOnly, MASKED_STRING, PATTERN_TYPE_CREDIT_CARD, PATTERN_TYPE_DEFAULT } = require('./lib/constants');
const dataMaskingService = require('./lib/data-masking-service');
const dataMaskingRegistry = require('./lib/data-masking-registry');

module.exports = {
  pathsToMask,
  pathsToMaskMatchOnly,
  MASKED_STRING,
  PATTERN_TYPE_CREDIT_CARD,
  PATTERN_TYPE_DEFAULT,
  dataMaskingService,
  dataMaskingRegistry,
};
