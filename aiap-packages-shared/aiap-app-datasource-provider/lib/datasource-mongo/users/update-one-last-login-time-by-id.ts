/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasoure-users-update-one-last-login-time-by-id'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1UpdateUserLastLoginTimeById,
  IResponseV1UpdateUserLastLoginTimeById,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  addSigle$SetAttributeToPipeline,
} from '@ibm-aiap/aiap-utils-mongo';

import {
  DatasourceAppV1Mongo,
} from '..';

export const updateOneLastLoginTimeById = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1UpdateUserLastLoginTimeById,
): Promise<IResponseV1UpdateUserLastLoginTimeById> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let filter;
  const UPDATE_PIPELINE = [];
  try {
    if (
      lodash.isEmpty(params?.id)
    ) {
      const MESSAGE = `Missing required params.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !lodash.isNumber(params?.lastLoginTime)
    ) {
      const MESSAGE = `Missing required params.lastLoginTime parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      !validator.isMongoId(params?.id) &&
      !validator.isAlphanumeric(params?.id, 'en-US', { ignore: '_-@.' })
    ) {
      const ERROR_MESSAGE = 'Required parameter params.id is invalid!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    filter = {
      _id: params?.id,
    };

    addSigle$SetAttributeToPipeline(
      UPDATE_PIPELINE,
      'lastLogin',
      params?.lastLoginTime,
    );

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT
      .__updateOne(context,
        {
          collection: datasource._collections.users,
          filter: filter,
          update: UPDATE_PIPELINE,
        });

    const RET_VAL = {
      modified: ramda.pathOr(0, ['modifiedCount'], RESPONSE)
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(MODULE_ID, { CONTEXT_USER_ID, params, filter, UPDATE_PIPELINE });
    logger.error(updateOneLastLoginTimeById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
