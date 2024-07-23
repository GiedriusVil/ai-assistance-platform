/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-client-utils-get-request-options';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

const _transform2RequestBody = (
  params: {
    state: {
      secureKey: string,
      userId: string,
      alias: string,
      transcriptPosition: any,
    },
    message?: {
      message?: {
        text?: string,
      }
    },
  },
) => {
  try {
    const SECURE_KEY = params?.state?.secureKey;
    const USER_ID = params?.state?.userId;
    const ALIAS = params?.state?.alias;
    const TRANSCRIPT_POSITION = params?.state?.transcriptPosition;

    const DETAILS: any = {
      secureKey: SECURE_KEY,
      userId: USER_ID,
      alias: ALIAS,
      transcriptPosition: TRANSCRIPT_POSITION
    };

    const MESSAGE_TEXT = params?.message?.message?.text;
    if (
      !lodash.isEmpty(MESSAGE_TEXT)
    ) {
      DETAILS.message = MESSAGE_TEXT
    }

    const FORM_BODY: Array<any> = [];
    for (const PROPERTY in DETAILS) {
      const ENCODED_KEY = encodeURIComponent(PROPERTY);
      const ENCODED_VALUE = encodeURIComponent(DETAILS[PROPERTY]);
      FORM_BODY.push(ENCODED_KEY + '=' + ENCODED_VALUE);
    }
    const RET_VAL = FORM_BODY.join('&');

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_transform2RequestBody.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

const getRequestOptions = (
  params: {
    state: {
      secureKey: string,
      userId: string,
      alias: string,
      transcriptPosition: any
    },
    message?: {
      message?: {
        text?: string,
      }
    }
  },
) => {
  try {

    const REQUEST_BODY = _transform2RequestBody(params);

    const RET_VAL = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: REQUEST_BODY,
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getRequestOptions.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  getRequestOptions
}
