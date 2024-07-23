/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-watson-language-translator-provider';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE, appendDataToError } from '@ibm-aca/aca-utils-errors';
import { IAiTranslationServiceV1, IAiTranslationServiceExternalWLTV1 } from '@ibm-aiap/aiap--types-server';

import { AcaWatsonLanguageTranslatorV3 } from './lib/watson-language-translator-v3';

const TRANSLATORS = {};

const _instanceId = (
  external: IAiTranslationServiceExternalWLTV1
) => {
  const AUTH_TYPE = external?.authType;
  const VERSION = external?.version;
  const URL = external?.url;
  const RET_VAL = `${AUTH_TYPE}:${VERSION}:${URL}`;
  return RET_VAL;
};

const _initWatsonLanguageTranslator = (
  external: IAiTranslationServiceExternalWLTV1
) => {
  const INSTANCE_ID = _instanceId(external);
  const RET_VAL = new AcaWatsonLanguageTranslatorV3(external);
  TRANSLATORS[INSTANCE_ID] = RET_VAL;
  logger.info(`INITIALIZED INSTANCE_ID: ${INSTANCE_ID}`, { external });
  return RET_VAL;
};

const getWatsonLanguageTranslatorByAiTranslationServiceExternal = (
  external: IAiTranslationServiceExternalWLTV1
) => {
  try {
    const INSTANCE_ID = _instanceId(external);
    let retVal = TRANSLATORS[INSTANCE_ID];
    if (
      lodash.isEmpty(retVal)
    ) {
      retVal = _initWatsonLanguageTranslator(external);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getWatsonLanguageTranslatorByAiTranslationServiceExternal.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
};

const getWatsonLanguageTranslatorByAiTranslationService = (
  aiTranslationService: IAiTranslationServiceV1
) => {
  const AI_TRANSLATION_SERVICE_ID = aiTranslationService?.id;
  const AI_TRANSLATION_SERVICE_EXTERNAL = aiTranslationService?.external;
  try {
    if (
      lodash.isEmpty(aiTranslationService)
    ) {
      const MESSAGE = `Missing required aiTranslationService parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(AI_TRANSLATION_SERVICE_EXTERNAL)
    ) {
      const MESSAGE = `Missing required aiTranslationService.external parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const RET_VAL = getWatsonLanguageTranslatorByAiTranslationServiceExternal(AI_TRANSLATION_SERVICE_EXTERNAL);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { AI_TRANSLATION_SERVICE_ID });
    logger.error(getWatsonLanguageTranslatorByAiTranslationService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  getWatsonLanguageTranslatorByAiTranslationService,
};
