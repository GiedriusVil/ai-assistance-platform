/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-watson-language-translator-provider-watson-language-translator-v3-identify';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } from '@ibm-aca/aca-utils-errors';

import { LanguageTranslatorV3 } from '@ibm-aiap/aiap-wrapper-ibm-watson';
import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { IIdentifyLanguageByTextParamsV1 } from '../types';

const identifyLanguageByText = async (
  languageTranslator: LanguageTranslatorV3,
  context: IContextV1,
  params: IIdentifyLanguageByTextParamsV1,
) => {
  let text;
  try {
    text = params?.text;
    if (lodash.isEmpty(text)) {
      const MESSAGE = 'Missing required params.text parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS: IIdentifyLanguageByTextParamsV1 = {
      text
    };
    const RESPONSE = await languageTranslator.identify(PARAMS);
    const RET_VAL = RESPONSE?.result;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { text });
    logger.error(identifyLanguageByText.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  identifyLanguageByText,
};
