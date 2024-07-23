/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-watson-language-translator-provider-watson-language-translator-v3-list-languages';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

import { LanguageTranslatorV3 } from '@ibm-aiap/aiap-wrapper-ibm-watson';
import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { IListLanguagesParamsV1 } from '../types';

const listLanguages = async (
  languageTranslator: LanguageTranslatorV3,
  context: IContextV1,
  params: IListLanguagesParamsV1,
) => {
  try {
    const RET_VAL = await languageTranslator.listLanguages();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(listLanguages.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  listLanguages,
};
