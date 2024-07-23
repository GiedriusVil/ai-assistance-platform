/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-chatgpt-v3-response-format-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceResponseV1,
  IAiServiceResponseExternalV1ChatGptV3,
} from '@ibm-aiap/aiap--types-server';

import {
  ISoeContextV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  IFormatResponseParamsV1,
  IFormatResponseResponseV1,
} from '../../../types';

export const formatOne = async (
  context: ISoeContextV1,
  params: IFormatResponseParamsV1,
): Promise<IFormatResponseResponseV1> => {

  let response: IAiServiceResponseV1;
  let external: IAiServiceResponseExternalV1ChatGptV3;

  let choices;
  let outputText;

  let retVal: IFormatResponseResponseV1;
  try {

    response = params?.aiServiceResponse;
    external = response.external as IAiServiceResponseExternalV1ChatGptV3;

    choices = external?.data?.choices;

    outputText = choices?.[0]?.text;

    retVal = {
      text: '',
    };

    if (
      !lodash.isEmpty(outputText) &&
      lodash.isString(outputText)
    ) {
      retVal.text = outputText;
    }

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(formatOne.name, { ACA_ERROR, response });
    throw ACA_ERROR;
  }
}

