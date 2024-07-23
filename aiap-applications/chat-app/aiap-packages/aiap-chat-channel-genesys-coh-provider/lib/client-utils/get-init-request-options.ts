/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-client-utils-get-init-request-url';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { ACA_ERROR_TYPE, appendDataToError, formatIntoAcaError, throwAcaError } from '@ibm-aca/aca-utils-errors';

import {
  IChatChannelV1GenesysCohV2Configuration,
} from '../types';

const getInitRequestOptions = (
  params: {
    conversationId: string,
    configuration: IChatChannelV1GenesysCohV2Configuration,
  },
) => {
  let conversationId;
  let service;
  try {
    if (
      lodash.isEmpty(params?.conversationId)
    ) {
      const ERROR_MESSAGE = 'Missing required params?.conversationId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.configuration?.external?.service)
    ) {
      const ERROR_MESSAGE = 'Missing required params?.configuration?.external?.service parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    conversationId = params?.conversationId;
    service = params?.configuration?.external?.service;

    const DETAILS = {
      nickname: `N-${conversationId}`,
      firstname: `F-${conversationId}`,
      lastname: `L-${conversationId}`,
      'userData[service]': `${service}`,
    };

    const FORM_BODY: Array<any> = [];
    for (const PROPERTY in DETAILS) {
      const encodedKey = encodeURIComponent(PROPERTY);
      const encodedValue = encodeURIComponent(DETAILS[PROPERTY]);
      FORM_BODY.push(encodedKey + '=' + encodedValue);
    }

    const REQUEST_BODY = FORM_BODY.join('&');

    const RET_VAL = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: REQUEST_BODY,
    };

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR,
      {
        conversationId,
        service,
      });
    logger.error(getInitRequestOptions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}


export {
  getInitRequestOptions,
}
