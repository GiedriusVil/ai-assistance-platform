/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-object-storage-express-routes-controller-files-save-one';
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
  IFileSaveOneParamsV1,
} from '@ibm-aiap/aiap-object-storage-datasource-provider';

import {
  constructActionContextFromRequest,
} from '@ibm-aiap/aiap-utils-express-routes';

import {
  filesService,
} from '@ibm-aiap/aiap-object-storage-service';

const saveOne = async (
  request: any,
  response: any,
) => {
  const ERRORS = [];

  let context: IContextV1;
  let params: IFileSaveOneParamsV1;

  let result;
  try {
    context = constructActionContextFromRequest(request);

    if (
      lodash.isEmpty(request?.body?.value)
    ) {
      const MESSAGE = `Missing erquired request?.body?.value parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const VALUE_TMP = JSON.parse(request?.body?.value);
    if (
      !lodash.isEmpty(request?.file)
    ) {
      VALUE_TMP.file = {
        originalname: request?.file?.originalname,
        encoding: request?.file?.encoding,
        mimetype: request?.file?.mimetype,
        path: request?.file?.path,
        size: request?.file?.size,
      };
    }
    params = {
      value: VALUE_TMP,
    };
    result = await filesService.saveOne(context, params);
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
