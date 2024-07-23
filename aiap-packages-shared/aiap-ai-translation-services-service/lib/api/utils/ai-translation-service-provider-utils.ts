/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-ai-translation-service-provider-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import { 
  formatIntoAcaError, 
  throwAcaError, 
  ACA_ERROR_TYPE, 
  appendDataToError 
} from '@ibm-aca/aca-utils-errors';

import {
  AI_TRANSLATION_SERVICE_TYPE_ENUM,
  IAiTranslationServiceV1,
  IContextV1
} from '@ibm-aiap/aiap--types-server';


const getAiTranslationServiceProviderByAiTranslationService = (
  context: IContextV1,
  params: {
    aiTranslationService: IAiTranslationServiceV1,
  }
) => {
  const USER = context?.user;
  const USER_ID = USER?.id;
  const AI_TRANSLATION_SERVICE = params?.aiTranslationService;
  const AI_TRANSLATION_SERVICE_ID = AI_TRANSLATION_SERVICE?.id;
  const AI_TRANSLATION_SERVICE_PROVIDER_TYPE = AI_TRANSLATION_SERVICE?.type;
  try {
    if (
        lodash.isEmpty(AI_TRANSLATION_SERVICE_PROVIDER_TYPE)
    ) {
        const MESSAGE = `Missing required params.aiTranslationService.type parameter!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    let retVal;

    let message;

    switch (AI_TRANSLATION_SERVICE_PROVIDER_TYPE) {
      case AI_TRANSLATION_SERVICE_TYPE_ENUM.WLT:
        retVal; // add here implementation;
        break;
      default: 
        message = `Unsupported AI_TRANSLATION_SERVICE_PROVIDER_TYPE!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, message);
    }

    if (
        lodash.isEmpty(retVal)
    ) {
        const MESSAGE = `Unable retrieve ai-translation-service-provider!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    return retVal;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID, AI_TRANSLATION_SERVICE_ID });
    logger.error(getAiTranslationServiceProviderByAiTranslationService.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  getAiTranslationServiceProviderByAiTranslationService,
};
