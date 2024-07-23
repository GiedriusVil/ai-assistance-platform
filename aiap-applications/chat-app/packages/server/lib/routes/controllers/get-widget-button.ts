/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-server-controller-get-widget-button';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import path from 'node:path';

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  ACA_ERROR_TYPE,
  throwAcaError
} from '@ibm-aca/aca-utils-errors';

const getWidgetButton = async (request, response) => {
  const ERRORS = [];

  let widgetFile;

  try {
    const ENGAGEMENT_ID = request?.query?.engagementId;
    const TENANT_ID = request?.query?.tenantId;
    const ASSISTANT_ID = request?.query?.assistantId;

    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = 'Missing required request.query.tenantId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ASSISTANT_ID)
    ) {
      const MESSAGE = 'Missing required request.query.assistantId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ENGAGEMENT_ID)
    ) {
      const MESSAGE = 'Missing required request.query.engagementId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    widgetFile = path.join(__dirname, '../../../../../../client/dist/client-widget/wbc-widget-button.min.js')
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
    logger.error(getWidgetButton.name, { ERRORS });
    return response.status(500).json({ errors: ERRORS });
  }
}


export default {
  getWidgetButton
};
