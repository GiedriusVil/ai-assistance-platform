/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-object-storage-express-routes-controller-files-changes-find-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  formatIntoAcaError,
  throwAcaError,
  ACA_ERROR_TYPE,
  appendContextToError,
  appendDataToError,
} from '@ibm-aca/aca-utils-errors';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IFileChangesFindOneByIdParamsV1,
} from '@ibm-aiap/aiap-object-storage-datasource-provider';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  filesChangesService,
} from '@ibm-aiap/aiap-object-storage-service';

const findOneById = async (
  request: any,
  response: any,
) => {
  const ERRORS = [];

  let context: IContextV1;
  let params: IFileChangesFindOneByIdParamsV1;

  let result;
  try {
    context = constructActionContextFromRequest(request);
    if (
      lodash.isEmpty(request?.body)
    ) {
      const MESSAGE = `Missing required request?.body?.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    params = {
      id: request?.body?.id,
    };

    result = await filesChangesService.findOneById(context, params);
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendContextToError(ACA_ERROR, context);
    appendDataToError(ACA_ERROR, { params });
    ERRORS.push(ACA_ERROR);
  }

  if (
    lodash.isEmpty(ERRORS)
  ) {
    response.status(200).json(result);
  } else {
    logger.error(findOneById.name, { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

export {
  findOneById,
}
