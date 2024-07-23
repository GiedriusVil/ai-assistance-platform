/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-server-controller-get-widget';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';
import path from 'node:path';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  getAcaEngagementsCacheProvider
} from '@ibm-aca/aca-engagements-cache-provider';


const getWidget = async (request, response) => {
  const ERRORS = [];
  let widgetFile;
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

    const DATASOURCE = getDatasourceV1App();
    const TENANT = await DATASOURCE.tenants.findOneById({}, { id: TENANT_ID });
    const ENGAGEMENTS_CACHE_PROVIDER = getAcaEngagementsCacheProvider();
    const ENGAGEMENT = await ENGAGEMENTS_CACHE_PROVIDER.engagements.findOneByIdAndHash({
      id: ENGAGEMENT_ID,
      tenant: TENANT
    });
    const CHAT_APP_VERSION = ramda.pathOr('0.1.0', ['chatApp', 'version'], ENGAGEMENT);
    switch (CHAT_APP_VERSION) {
      case '0.3.0':
        widgetFile = path.join(__dirname, '../../../../../../client/dist/client-widget/wbc-widget.min.js')
        break;
      case '0.2.0':
        widgetFile = path.join(__dirname, '../../../../../../client/dist/client-widget/wbc-widget.min.js')
        break;
      case '0.1.0':
        widgetFile = path.join(__dirname, '../../../../../../client/dist/client-widget/widget.min.js')
        break;
    }
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
      .sendFile(widgetFile);
  } else {
    logger.error('->', { ERRORS });
    return response.status(500).json({ errors: ERRORS });
  }

}
export default {
  getWidget
}
