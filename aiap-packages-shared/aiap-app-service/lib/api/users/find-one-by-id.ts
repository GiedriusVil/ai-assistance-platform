/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `app-service-users-find-one-by-id`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1FindUserById,
  IUserV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

export const findOneById = async (
  context: IContextV1,
  params: IParamsV1FindUserById,
): Promise<IUserV1> => {
  try {
    const DATASOURCE = getDatasourceV1App();
    const RET_VAL = await DATASOURCE.users.findOneById(context, params);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(findOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
