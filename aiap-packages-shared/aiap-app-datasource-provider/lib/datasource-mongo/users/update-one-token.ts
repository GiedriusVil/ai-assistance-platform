/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-app-datasoure-users-update-one-token'
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1UpdateUserToken,
  IResponseV1UpdateUserToken,
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

export const updateOneToken = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1UpdateUserToken,
): Promise<IResponseV1UpdateUserToken> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let filter;
  const UPDATE_PIPELINE = [];
  try {
    if (
      lodash.isEmpty(params?.value?.id)
    ) {
      const ERROR_MESSAGE = 'Missing params.id required parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    if (
      !validator.isMongoId(params?.value?.id) &&
      !validator.isAlphanumeric(params?.value?.id, 'en-US', { ignore: '_-@.' })
    ) {
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, 'Mandatory parameter id invalid!');
    }
    if (
      !lodash.isEmpty(params?.token)
    ) {
      addSigle$SetAttributeToPipeline(UPDATE_PIPELINE, 'token', params?.token);
    } else {
      UPDATE_PIPELINE.push({
        $unset: 'token'
      });
    }

    filter = {
      _id: params?.value?.id,
    };

    const MONGO_CLIENT = await datasource._getMongoClient();
    const RESPONSE = await MONGO_CLIENT
      .__updateOne(
        context,
        {
          collection: datasource._collections.users,
          filter: filter,
          update: UPDATE_PIPELINE,
        }
      );

    const RET_VAL = {
      modified: ramda.pathOr(0, ['modifiedCount'], RESPONSE)
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, UPDATE_PIPELINE });
    logger.error(updateOneToken.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
