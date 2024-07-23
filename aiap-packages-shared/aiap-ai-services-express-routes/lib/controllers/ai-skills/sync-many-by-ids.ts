/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-services-express-routes-ai-skills-sync-many-by-ids';
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

export const syncManyByIds = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const ERRORS = [];

  let context;
  let contextUserId;

  let ids;
  let options;

  let params;
  let result;
  try {
    context = constructActionContextFromRequest(request);
    contextUserId = context?.user?.id;

    ids = request?.body?.ids;
    options = request?.body?.options;

    params = { ids, options };
    result = await aiSkillsService.syncManyByIds(context, params);
  } catch (error) {
    const ACA_ERRROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERRROR, { contextUserId, ids, options });
    ERRORS.push(ACA_ERRROR);
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(syncManyByIds.name, { errors: ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
}
