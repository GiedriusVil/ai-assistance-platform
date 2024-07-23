/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-app-server-controller-custom-css';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  getAcaEngagementsCacheProvider
} from '@ibm-aca/aca-engagements-cache-provider';

import {
  getTenantsCacheProvider
} from '@ibm-aiap/aiap-tenants-cache-provider';

import {
  decodeValueWithBase64
} from './utils';

const customCss = async (request, response) => {
  const ERRORS = [];
  let result;
  try {
    const REQUEST_PARAMS = request?.params;
    const TENANT_ID = REQUEST_PARAMS?.tenantId;
    const TENANT_HASH = REQUEST_PARAMS?.tenantHash;
    const ENGAGEMENT_ID = REQUEST_PARAMS?.engagementId;

    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = 'Missing required request.params.tenantId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(TENANT_HASH)
    ) {
      const MESSAGE = 'Missing required request.params.tenantHash parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    if (
      lodash.isEmpty(ENGAGEMENT_ID)
    ) {
      const MESSAGE = 'Missing required request.params.engagementId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const TENANTS_CACHE_PROVIDER = getTenantsCacheProvider();

    const TENANT = await TENANTS_CACHE_PROVIDER.tenants.findOneByIdAndHash({ id: TENANT_ID, hash: TENANT_HASH });

    const ENGAGEMENTS_CACHE_PROVIDER = getAcaEngagementsCacheProvider();
    const RET_VAL = await ENGAGEMENTS_CACHE_PROVIDER.engagements.findOneByIdAndHash({
      id: ENGAGEMENT_ID,
      tenant: TENANT
    });
    if (!lodash.isEmpty(RET_VAL)) {
      const STYLES = RET_VAL?.styles?.value;
      const DECODED_STYLES = decodeValueWithBase64(STYLES);
      const fileArr = request.params.fileName.split('.');
      if (fileArr.length > 0) {
        const extension = fileArr[fileArr.length - 1];
        if (extension === 'css') {
          result = DECODED_STYLES;
        }
      }
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
      .type('css')
      .send(result);
  } else {
    logger.error('->', { ERRORS });
    return response.status(500).json({ errors: ERRORS });
  }

}
export default {
  customCss
}
