/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasoure-users-update-one-last-session-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const validator = require('validator');

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
  IContextUserV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1UpdateUserLastSession,
  IResponseV1UpdateUserLastSession,
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

const _constructLastSession = (
  params: {
    value: IContextUserV1,
  },
) => {
  const RET_VAL: any = {
    timestamp: Date.now(),
  }
  if (
    !lodash.isEmpty(params?.value?.session?.tenant?.id) &&
    !lodash.isEmpty(params?.value?.session?.tenant?.hash)
  ) {
    RET_VAL.tenant = {
      id: params?.value?.session?.tenant?.id,
      hash: params?.value?.session?.tenant?.hash,
    }
    if (
      !lodash.isEmpty(params?.value?.session?.tenant?.applications)
    ) {
      RET_VAL.tenant.applications = params?.value?.session?.tenant?.applications;
    }
    if (
      !lodash.isEmpty(params?.value?.session?.application)
    ) {
      RET_VAL.application = params?.value?.session?.application;
    }
  }
  return RET_VAL;
}

export const updateOneLastSessionById = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: IParamsV1UpdateUserLastSession,
): Promise<IResponseV1UpdateUserLastSession> => {
  const CONTEXT_USER_ID = context?.user?.id;

  let filter;
  let lastSession;
  const UPDATE_PIPELINE = [];
  try {
    if (
      lodash.isEmpty(params?.value?.id)
    ) {
      const MESSAGE = 'Missing params.value.id required parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE)
    }
    if (
      !validator.isMongoId(params?.value?.id) &&
      !validator.isAlphanumeric(params?.value?.id, 'en-US', { ignore: '_-@.' })
    ) {
      const ERROR_MESSAGE = 'Required parameter params.value.id is invalid!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    filter = {
      _id: params?.value?.id,
    };

    lastSession = _constructLastSession(params);

    addSigle$SetAttributeToPipeline(UPDATE_PIPELINE, 'lastSession', lastSession);

    const ACA_MONGO_CLIENT = await datasource._getAcaMongoClient();
    const RESPONSE = await ACA_MONGO_CLIENT
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
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, params, filter, lastSession, UPDATE_PIPELINE });
    logger.error(updateOneLastSessionById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
