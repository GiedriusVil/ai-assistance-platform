/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-watson-assistant-v2-response-format-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceResponseExternalV1WaV2,
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

  let external: IAiServiceResponseExternalV1WaV2;

  let generic;
  let retVal: IFormatResponseResponseV1;
  try {

    external = params?.aiServiceResponse?.external as IAiServiceResponseExternalV1WaV2;
    generic = external?.result?.output?.generic;

    retVal = {
      text: '',
    };

    if (
      !lodash.isEmpty(generic) &&
      lodash.isArray(generic)
    ) {
      for (const TMP_ITEM of generic) {
        switch (TMP_ITEM?.response_type) {
          case 'text':
            if (
              !lodash.isEmpty(TMP_ITEM?.text) &&
              lodash.isString(TMP_ITEM?.text)
            ) {
              retVal.text = retVal.text.concat(TMP_ITEM?.text);
            }
            break;
          default:
            break;
        }
      }
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(formatOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
