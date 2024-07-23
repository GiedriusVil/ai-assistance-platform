/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-watson-language-translator-provider-watson-language-translator-v3-delete-model';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } from '@ibm-aca/aca-utils-errors';

import { LanguageTranslatorV3 } from '@ibm-aiap/aiap-wrapper-ibm-watson';
import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { IDeleteModelParamsV1 } from '../types';

const deleteModel = async (
  languageTranslator: LanguageTranslatorV3,
  context: IContextV1,
  params: IDeleteModelParamsV1,
) => {
  let modelId;
  try {
    modelId = params?.modelId;
    if (lodash.isEmpty(modelId)) {
      const MESSAGE = 'Missing required params.name parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const PARAMS: IDeleteModelParamsV1 = {
      modelId,
    };

    const RET_VAL = await languageTranslator.deleteModel(PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { modelId });
    logger.error(deleteModel.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  deleteModel,
};
