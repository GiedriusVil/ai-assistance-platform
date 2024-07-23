/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-translation-services-service-datasource-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import { 
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import {
  transformContextForLogger
} from '@ibm-aca/aca-data-transformer';

import {
  getAiTranslationServicesDatasourceByContext
} from '@ibm-aiap/aiap-ai-translation-services-datasource-provider';

import {
  IContextV1
} from '@ibm-aiap/aiap--types-server';


const getDatasourceByContext = (
  context: IContextV1
) => {
  try {
    const RET_VAL = getAiTranslationServicesDatasourceByContext(context);
    if (
      lodash.isEmpty(RET_VAL)
    ) {
      const MESSAGE = 'Unable to retrieve Ai Translation Services datasource!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE, { context: transformContextForLogger(context) });
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(getDatasourceByContext.name, { error: error });
    throw ACA_ERROR;
  }
}

export {
  getDatasourceByContext,
}
