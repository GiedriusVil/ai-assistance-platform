/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-channel-client-refresh-chat';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  execHttpPostRequest,
} from '@ibm-aca/aca-wrapper-http';


import {
  getRequestOptions,
  getRequestUrl,
} from '../client-utils';

import {
  transformGenesysResponseBody,
} from '../client-transformer';

import {
  IChatChannelV1GenesysCohV2Configuration,
} from '../types';

const refreshChat = async (
  params: {
    conversationIdExternal: string,
    configuration: IChatChannelV1GenesysCohV2Configuration,
    state: {
      secureKey: string,
      userId: string,
      alias: string,
      transcriptPosition: any,
    },
  }
) => {
  let url;
  let options;

  let requestParams;
  let additionalOptions;
  let response;
  try {
    url = getRequestUrl(
      {
        action: 'refresh',
        ...params,
      });
    options = getRequestOptions(params)
    logger.info(refreshChat.name, { url, options, });

    requestParams = {
      url: url,
      ...options,
    };

    additionalOptions = {
      json: false,
    };
    response = await execHttpPostRequest({}, requestParams, additionalOptions);

    const RESPONSE_HEADERS = response?.headers;
    const RESPONSE_BODY = response?.body;
    logger.info(refreshChat.name, {
      headers: RESPONSE_HEADERS,
      body: RESPONSE_BODY
    });

    const RET_VAL = transformGenesysResponseBody(RESPONSE_BODY);
    logger.info(refreshChat.name, {
      transformedResponse: RET_VAL,
    });

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { requestParams, response });
    logger.error(refreshChat.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  refreshChat,
}
