/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-watson-language-translator-provider-watson-language-translator-v3-list-models';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { LanguageTranslatorV3 } from '@ibm-aiap/aiap-wrapper-ibm-watson';
import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { IListModelsParamsV1 } from '../types';

const listModels = async (
  languageTranslator: LanguageTranslatorV3,
  context: IContextV1,
  params: IListModelsParamsV1
) => {
  try {
    const PARAMS: IListModelsParamsV1 = params?.onlyCustomModels ? { _default: false } : {};
    const RET_VAL = await languageTranslator.listModels(PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(listModels.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  listModels,
};
