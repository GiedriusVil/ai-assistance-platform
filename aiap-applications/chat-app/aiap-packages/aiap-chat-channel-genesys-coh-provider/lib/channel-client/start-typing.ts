/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-channel-genesys-coh-provider-channel-client-start-typing';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import { execHttpPostRequest } from '@ibm-aca/aca-wrapper-http';

import {
  getRequestUrl,
  getRequestOptions,
} from '../client-utils';

import {
  IChatChannelV1GenesysCohV2Configuration,
} from '../types';

const startTyping = async (
  params: {
    configuration: IChatChannelV1GenesysCohV2Configuration,
    conversationIdExternal: string,
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
        action: 'startTyping',
        ...params,
      });
    options = getRequestOptions(params);
    logger.info(startTyping.name, { url, options });

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
    logger.info(startTyping.name, {
      headers: RESPONSE_HEADERS,
      body: RESPONSE_BODY
    });

    return response;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { requestParams, response });
    logger.error(startTyping.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  startTyping,
}
