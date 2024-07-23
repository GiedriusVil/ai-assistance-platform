/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-express-routes-ai-skills-sync-many-by-files';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  aiSkillsService,
} from '@ibm-aiap/aiap-ai-services-service';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';

export const syncManyByFiles = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];

  let context;
  let contextUserId;

  let aiServiceId;

  let files;
  let params;
  let result;
  try {
    context = constructActionContextFromRequest(request);
    contextUserId = context?.user?.id;

    files = request?.files;
    aiServiceId = request?.query?.aiServiceId;

    params = { aiServiceId, files };
    result = await aiSkillsService.syncManyByFiles(context, params);
  } catch (error) {
    const ACA_ERRROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERRROR, { contextUserId, aiServiceId });
    ERRORS.push(ACA_ERRROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(syncManyByFiles.name, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}
