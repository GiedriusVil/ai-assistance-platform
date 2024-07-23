/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-adapter-provider-adapter-aws-lex-v2-response-format-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  IAiServiceResponseExternalV1AwsLexV2,
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

  let external: IAiServiceResponseExternalV1AwsLexV2;
  let messages: Array<any>;

  let retVal: IFormatResponseResponseV1;
  try {
    external = params?.aiServiceResponse?.external as IAiServiceResponseExternalV1AwsLexV2;
    messages = external.messages;

    retVal = {
      text: '',
    };

    if (
      !lodash.isEmpty(messages) &&
      lodash.isArray(messages)
    ) {
      for (const TMP_MESSAGE of messages) {

        switch (TMP_MESSAGE?.contentType) {
          case 'PlainText':
            if (
              !lodash.isEmpty(TMP_MESSAGE?.content) &&
              lodash.isString(TMP_MESSAGE?.content)
            ) {
              retVal.text = retVal.text.concat(TMP_MESSAGE?.content);
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
