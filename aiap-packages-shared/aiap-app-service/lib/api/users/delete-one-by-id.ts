/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-users-delete-one-by-id';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1DeleteUserById,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  appendDataToError,
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import * as usersChangesService from '../users-changes';

const _saveUserChanges = async (
  context: IContextV1,
  params: {
    id?: any,
  }
) => {
  const CHANGE = {
    action: CHANGE_ACTION.DELETE_ONE_BY_ID,
    docId: params.id,
    docType: 'USER',
    docName: params?.id,
    doc: null,
    docChanges: null,
    timestamp: new Date(),
  }
  await usersChangesService.saveOne(context, { value: CHANGE });
}

export const deleteOneById = async (
  context: IContextV1,
  params: IParamsV1DeleteUserById,
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  try {
    const DATASOURCE = getDatasourceV1App();
    const RET_VAL = await DATASOURCE.users.deleteOneById(context, params);
    if (
      RET_VAL
    ) {
      await _saveUserChanges(context, params);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID });
    logger.error(deleteOneById.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
