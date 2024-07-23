/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-users-update-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const bcryptjs = require('bcryptjs');

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1UpdateUser,
  IUserV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  validateUserPassword,
} from '../../utils/password-policy-utils';

import * as usersChangesService from '../users-changes';

const saveAuditRecord = async (
  context: IContextV1,
  params: {
    value: IUserV1,
  }
) => {
  const CHANGE = {
    action: CHANGE_ACTION.UPDATE_ONE,
    docId: params.value.username,
    docType: 'USER',
    docName: params?.value?.username,
    doc: params?.value,
    docChanges: null,
    timestamp: new Date(),
  }
  await usersChangesService.saveOne(context, { value: CHANGE });
}

const _adjustUser = (
  user: IUserV1,
) => {
  const PASSWORD = user?.password;

  if (
    !lodash.isEmpty(PASSWORD)
  ) {
    validateUserPassword(user);
    user.password = user.password ? bcryptjs.hashSync(user.password, 10) : undefined;
    user.passwordLastSet = new Date().getTime();
  } else {
    user = ramda.dissocPath(['password'], user);
  }
  return user;
}

export const updateOne = async (
  context: IContextV1,
  params: IParamsV1UpdateUser,
) => {

  let value: IUserV1;
  try {
    value = params?.value;

    value = _adjustUser(value);
    appendAuditInfo(context, value);

    const DATASOURCE = getDatasourceV1App();
    const RET_VAL = await DATASOURCE.users.saveOne(context, { value });
    if (
      RET_VAL
    ) {
      await saveAuditRecord(context, params);
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(updateOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
