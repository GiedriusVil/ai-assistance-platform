/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-users-create-one';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const bcryptjs = require('bcryptjs');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  CHANGE_ACTION,
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  IParamsV1CreateUser,
  IUserV1,
} from '@ibm-aiap/aiap--types-domain-app';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  appendAuditInfo,
} from '@ibm-aiap/aiap-utils-audit';

import {
  fromBase64ToString,
} from '@ibm-aca/aca-utils-codec';

import {
  validateUserPassword,
} from '../../utils/password-policy-utils';

import * as usersChangesService from '../users-changes';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

const saveAuditRecord = async (
  context: IContextV1,
  params: {
    user: IUserV1,
  }
) => {
  const CHANGE = {
    action: CHANGE_ACTION.CREATE_ONE,
    docId: params?.user?.username,
    docType: 'USER',
    docName: params?.user?.username,
    doc: params?.user,
    docChanges: null,
    timestamp: new Date(),
  }
  await usersChangesService.saveOne(context, { value: CHANGE });
}

const _adjustUser = (
  user: IUserV1,
) => {
  if (
    user?.password
  ) {
    user.password = bcryptjs.hashSync(user?.password, 10);
    user.passwordLastSet = new Date().getTime();
  }
}

export const createOne = async (
  context: IContextV1,
  params: IParamsV1CreateUser,
) => {
  const USER = params?.value;

  const USER_TYPE = USER?.type;

  const SEND_TO_DECODE: any = {};
  SEND_TO_DECODE.input = USER.password;

  try {
    if (
      !lodash.isEmpty(SEND_TO_DECODE.input)
    ) {
      const DECODED_PASSWORD = fromBase64ToString(SEND_TO_DECODE);
      USER.password = DECODED_PASSWORD;
    }

    if (
      USER_TYPE != 'sso'
    ) {
      validateUserPassword(USER);
    }
    _adjustUser(USER);
    appendAuditInfo(context, USER);

    const DATASOURCE = getDatasourceV1App();
    const RET_VAL = await DATASOURCE.users.saveOne(context, params);

    // TODO -> LEGO -> FIX THIS LOG -> IT IS EXPOSING TOO MUCH
    // logger.debug(`[${MODULE_ID}][createOne][user]: ${RET_VAL}`);

    if (
      RET_VAL
    ) {
      await saveAuditRecord(context, { user: params?.value });
    }

    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(createOne.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
