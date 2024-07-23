/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-watson-language-translator-provider-watson-language-translator-v3-create-model';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } from '@ibm-aca/aca-utils-errors';

import { LanguageTranslatorV3 } from '@ibm-aiap/aiap-wrapper-ibm-watson';
import { IContextV1 } from '@ibm-aiap/aiap--types-server';
import { ICreateModelParamsV1 } from '../types';

enum modelTypes {
  FORCED_GLOSSARY = 'forcedGlossary',
  PARALLEL_CORPUS = 'parallelCorpus',
};

const createModel = async (
  languageTranslator: LanguageTranslatorV3,
  context: IContextV1,
  params: ICreateModelParamsV1,
) => {
  let baseModelId;
  let type;
  let examples;
  try {
    baseModelId = params?.baseModelId;
    type = params?.type;
    examples = params?.examples;
    if (lodash.isEmpty(baseModelId)) {
      const MESSAGE = 'Missing required params.baseModelId parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(type)) {
      const MESSAGE = 'Missing required params.type parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (lodash.isEmpty(examples)) {
      const MESSAGE = 'Required params.examples is empty';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    const PARAMS: ICreateModelParamsV1 = {
      baseModelId,
    };

    let errorMessage;

    examples = JSON.stringify(examples);

    switch (type) {
      case modelTypes.FORCED_GLOSSARY:
        PARAMS.forcedGlossary = Buffer.from(examples);
        PARAMS.forcedGlossaryContentType = 'application/json';
        break;
      case modelTypes.PARALLEL_CORPUS:
        PARAMS.parallelCorpus = Buffer.from(examples);
        PARAMS.parallelCorpusContentType = 'application/json';
        break;
      default:
        errorMessage = 'Unsupported model type!';
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, errorMessage);
    }

    const RET_VAL = await languageTranslator.createModel(PARAMS);
    
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { baseModelId, type, examples });
    logger.error(createModel.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

export {
  createModel,
};
