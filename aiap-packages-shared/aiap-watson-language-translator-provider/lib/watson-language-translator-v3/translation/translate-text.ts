/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-watson-language-translator-provider-watson-language-translator-v3-translate';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } from '@ibm-aca/aca-utils-errors';

import { LanguageTranslatorV3 } from '@ibm-aiap/aiap-wrapper-ibm-watson';
import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { ITranslateTextParamsV1 } from '../types';

const translateText = async (
  languageTranslator: LanguageTranslatorV3,
  context: IContextV1,
  params: ITranslateTextParamsV1,
) => {
  let text;
  let modelId;
  let target;
  let source;
  try {
    text = params?.text;
    modelId = params?.modelId;
    source = params?.source;
    target = params?.target;
    if (lodash.isEmpty(text)) {
      const MESSAGE = 'Missing required params.text parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(modelId) && lodash.isEmpty(target)) {
      const MESSAGE = 'params.modelId or params.target is required!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS: ITranslateTextParamsV1 = {
      text,
      modelId,
      source,
      target,
    };
    const RESPONSE = await languageTranslator.translate(PARAMS);
    const RET_VAL = RESPONSE?.result;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { text, modelId });
    logger.error(translateText.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  translateText,
};
