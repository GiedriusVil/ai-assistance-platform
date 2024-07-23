/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-server-controller-get-widget';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import path from 'node:path';

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';

const getDeprecated = async (request, response) => {
  const ERRORS = [];

  let widgetFile;

  try {
    widgetFile = path.join(__dirname, '../../../../../../client/dist/client-widget/deprecated.min.js')
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }

  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    return response
      .status(200)
      .type('js')
      .sendFile(widgetFile);
  } else {
    logger.error('->', { ERRORS });
    return response.status(500).json({ errors: ERRORS });
  }

}
export default {
  getDeprecated
}
