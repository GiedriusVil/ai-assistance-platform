/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-ai-service-express-routes-ai-services-export-many-by-query';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  currentDateAsString,
} from '@ibm-aiap/aiap-utils-date';

import {
  constructActionContextFromRequest,
  constructDefaultFindManyQueryFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  aiServicesService,
} from '@ibm-aiap/aiap-ai-services-service';

import {
  IExpressRequestV1,
  IExpressResponseV1
} from '@ibm-aiap/aiap--types-server';

const _constructFileName = (
  context: IContextV1,
) => {
  try {
    const TENANT_ID = context?.user?.session?.tenant?.id;
    const RET_VAL = `[${TENANT_ID}]ai-services.${currentDateAsString()}.json`;
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error('_constructFileName', { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const exportManyByQuery = async (
  request: IExpressRequestV1,
  response: IExpressResponseV1,
) => {
  const CONTEXT = constructActionContextFromRequest(request);
  const USER = ramda.path(['user'], CONTEXT);
  const USER_ID = ramda.path(['id'], USER);
  const DEFAULT_QUERY = constructDefaultFindManyQueryFromRequest(request);
  const ERRORS = [];
  let result;
  try {
    const RESULT = await aiServicesService.findManyByQuery(CONTEXT,
      {
        query: {
          filter: {},
          sort: DEFAULT_QUERY?.sort,
          pagination: DEFAULT_QUERY?.pagination,
        },
      });
    if (
      lodash.isEmpty(RESULT?.items)
    ) {
      const MESSAGE = `Unable to find ai-services!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    result = RESULT?.items;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { USER_ID });
    ERRORS.push({ ACA_ERROR });
  }
  if (
    lodash.isEmpty(ERRORS)
  ) {
    const FILE_NAME = _constructFileName(CONTEXT);
    response.setHeader('Content-disposition', `attachment; filename=${FILE_NAME}`);
    response.set('Content-Type', 'application/json');
    response.status(200).json(result);
  } else {
    logger.error(exportManyByQuery.name, { ERRORS });
    response.status(400).json(ERRORS);
  }
};
