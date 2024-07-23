/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-service-service-ai-skills-sync-many-by-files';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
  IAiServiceV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getAiServicesDatasourceByContext,
} from '../utils/datasource-utils';

import {
  syncOneByFile,
} from './sync-one-by-file';

export const syncManyByFiles = async (
  context: IContextV1,
  params: {
    aiServiceId: any,
    files: Array<any>,
  },
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const FILES = params?.files;

  let aiService: IAiServiceV1;

  try {
    const DATASOURCE = getAiServicesDatasourceByContext(context);
    if (
      lodash.isEmpty(params?.aiServiceId)
    ) {
      const ERROR_MESSAGE = `Missing required params.aiServiceId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(params?.files)
    ) {
      const ERROR_MESSAGE = `Missing required params.files parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !lodash.isArray(params?.files)
    ) {
      const ERROR_MESSAGE = `Wrong type of params.files parameter! [Array - expected]`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    aiService = await DATASOURCE.aiServices.findOneById(context,
      {
        id: params?.aiServiceId,
      });

    if (
      lodash.isEmpty(aiService)
    ) {
      const ERROR_MESSAGE = `Unable to retrieve aiService!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    if (
      lodash.isEmpty(aiService?.type)
    ) {
      const ERROR_MESSAGE = `Retrieved corrupted aiService - missing aiService.type!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, ERROR_MESSAGE);
    }
    const PROMISES = [];
    for (const FILE of FILES) {
      PROMISES.push(
        syncOneByFile(context,
          {
            aiService: {
              id: aiService?.id,
              type: aiService?.type,
            },
            file: FILE,
          }
        ));
    }
    const RET_VAL = await Promise.all(PROMISES);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(syncManyByFiles.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
