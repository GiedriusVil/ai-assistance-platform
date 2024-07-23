/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-channel-client-request-chat';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE,
} from '@ibm-aca/aca-utils-errors';

import {
  execHttpPostRequest,
} from '@ibm-aca/aca-wrapper-http';

import {
  getInitRequestUrl,
  getInitRequestOptions,
  retrieveSafeRequestBody,
} from '../client-utils';

import {
  IChatChannelV1GenesysCohV2Configuration,
} from '../types';

const requestChat = async (
  params: {
    conversationId: string,
    configuration: IChatChannelV1GenesysCohV2Configuration,
  }
) => {
  let requestUrl;
  let requestOptions;
  let requestParams;
  let additionalOptions;
  let response;
  try {

    requestUrl = getInitRequestUrl(params);
    requestOptions = getInitRequestOptions(params);

    logger.info(requestChat.name, {
      url: requestUrl,
      options: requestOptions,
    });

    requestParams = {
      url: requestUrl,
      ...requestOptions,
    };

    additionalOptions = {
      json: false,
    };

    response = await execHttpPostRequest({}, requestParams, additionalOptions);

    const RESPONSE_HEADERS = response?.headers;
    const RESPONSE_BODY = retrieveSafeRequestBody(response);

    logger.info(requestChat.name, { RESPONSE_HEADERS, RESPONSE_BODY });

    if (
      lodash.isEmpty(RESPONSE_BODY)
    ) {
      const ERROR_MESSAGE = `Missing required REQUEST_BODY variable!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }

    const RET_VAL = {
      secureKey: RESPONSE_BODY?.secureKey,
      chatId: RESPONSE_BODY?.chatId,
      userId: RESPONSE_BODY?.userId,
      alias: RESPONSE_BODY?.alias,
      transcriptPosition: RESPONSE_BODY?.nextPosition,
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, {
      requestParams,
      response
    });
    logger.error(requestChat.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  requestChat,
}
