/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-server-controller-get-widget';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import path from 'node:path';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

const getWidgetDefault = async (request, response) => {
  const ERRORS = [];
  let defaultWidgetFile;
  try {
    const TENANT_ID = request?.query?.tenantId;
    const ASSISTANT_ID = request?.query?.assistantId;
    const ENGAGEMENT_ID = request?.query?.engagementId;

    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = 'Missing required request.params.tenantId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ASSISTANT_ID)
    ) {
      const MESSAGE = 'Missing required request.params.tenantHash parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ENGAGEMENT_ID)
    ) {
      const MESSAGE = 'Missing required request.query.engagementId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    defaultWidgetFile = path.join(__dirname, '../../../../../../client/dist/client-widget/default.min.js')

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    return response
      .status(200)
      .type('js')
      .sendFile(defaultWidgetFile);
  } else {
    logger.error('->', { ERRORS });
    return response.status(500).json({ errors: ERRORS });
  }

}
export default {
  getWidgetDefault
}
