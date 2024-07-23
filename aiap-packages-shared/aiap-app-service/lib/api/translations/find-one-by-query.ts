/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-translations-find-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

export const findOneByQuery = async (
  context: IContextV1,
  params: {
    query?: {
      filter?: {
        application?: any,
        lang?: any,
      }
    },
  },
) => {
  try {
    const APPLICATION = params?.query?.filter?.application;
    const LANG = params?.query?.filter?.lang;
    if (
      lodash.isEmpty(APPLICATION)
    ) {
      const ERROR_MESSAGE = 'Missing required params?.query?.filter?.application parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    if (
      lodash.isEmpty(LANG)
    ) {
      const ERROR_MESSAGE = 'Missing required params?.query?.fitler?.lang parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const RET_VAL = require(`../../../../../aiap-applications/${APPLICATION}/client/dist/client/assets/i18n/${LANG}.json`)

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOneByQuery.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
