/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-users-update-one-last-login-time-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1UpdateUserLastLoginTimeById,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

export const updateOneLastLoginTimeById = async (
  context: IContextV1,
  params: IParamsV1UpdateUserLastLoginTimeById,
) => {
  const PARAMS_ID = params?.id;
  let tmpParams;
  try {
    const DATASOURCE = getDatasourceV1App();
    if (
      lodash.isEmpty(PARAMS_ID)
    ) {
      const ERROR_MESSAGE = 'Missing params.id required parameter!';
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }
    tmpParams = {
      id: PARAMS_ID,
      lastLoginTime: new Date().getTime()
    }
    const RET_VAL = await DATASOURCE.users.updateOneLastLoginTimeById(context, tmpParams);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { tmpParams });
    logger.error(updateOneLastLoginTimeById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
