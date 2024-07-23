/*
  © Copyright IBM Corporation 2022. All Rights Reserved.

  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-chat-rest-server-provider-session-provider-registry-get-registry`;
const logger = require(`@ibm-aca/aca-common-logger`)(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';


const REGISTRY = {};

const getRegistry = () => {
  return REGISTRY;
}


export {
  getRegistry,
}
