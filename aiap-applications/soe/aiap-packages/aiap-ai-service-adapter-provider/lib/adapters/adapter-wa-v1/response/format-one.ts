/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-wa-v1-response-format-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceResponseV1,
  IAiServiceResponseExternalV1WaV1,
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
  let external: IAiServiceResponseExternalV1WaV1;
  let output;

  let outputText;
  let outputGeneric;

  let retVal: IFormatResponseResponseV1;
  try {
    response = params?.aiServiceResponse;
    external = response?.external as IAiServiceResponseExternalV1WaV1;

    output = external?.result?.output;
    if (
      !lodash.isEmpty(output)
    ) {
      outputText = output?.text;

      retVal = {
        text: '',
      };

      if (
        lodash.isEmpty(outputText)
      ) {
        retVal.text = '';
      } else if (
        lodash.isString(outputText)
      ) {
        retVal.text = outputText;
      } else if (
        lodash.isArray(outputText)
      ) {
        retVal.text = outputText.join('');
      }
      outputGeneric = output?.generic;
      if (
        lodash.isArray(outputGeneric) &&
        !lodash.isEmpty(outputGeneric)
      ) {
        const TMP_GENERIC_TEXTS = [];

        for (const TMP_GENERIC of outputGeneric) {
          if (
            TMP_GENERIC?.response_type === 'text' &&
            !lodash.isEmpty(TMP_GENERIC?.text)
          ) {
            TMP_GENERIC_TEXTS.push(TMP_GENERIC?.text);
          }
        }
        retVal.text = TMP_GENERIC_TEXTS.join('');
      }
    }

    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(formatOne.name, { ACA_ERROR, response });
    throw ACA_ERROR;
  }
}
