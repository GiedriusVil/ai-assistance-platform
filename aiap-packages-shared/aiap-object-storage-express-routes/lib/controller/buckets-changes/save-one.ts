/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-object-storage-express-routes-controller-buckets-changes-save-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

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
  IBucketChangesSaveOneParamsV1,
} from '@ibm-aiap/aiap-object-storage-datasource-provider';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  bucketsChangesService,
} from '@ibm-aiap/aiap-object-storage-service';


const saveOne = async (request, response) => {
  const ERRORS = [];

  let context: IContextV1;
  let params: IBucketChangesSaveOneParamsV1;

  let result;
  try {
    context = constructActionContextFromRequest(request);
    if (
      lodash.isEmpty(request?.body?.value)
    ) {
      const MESSAGE = `Missing erquired request?.body?.value parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    params = {
      value: request?.body?.value,
    };
    result = await bucketsChangesService.saveOne(context, params);
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
    logger.error(saveOne.name, { ERRORS });
    response.status(500).json({ errors: ERRORS });
  }
};

export {
  saveOne,
}
