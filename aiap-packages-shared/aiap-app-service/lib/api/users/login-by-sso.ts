/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-users-login-by-sso';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

import {
  getLibConfiguration,
} from '../../configuration';

import {
  assignExternalAccessGroups,
} from '../../utils/external-access-groups';

import {
  authorizeUser,
} from './authorize-user';

import {
  createOne,
} from './create-one';
import { IContextV1 } from '@ibm-aiap/aiap--types-server';

const isSSO = user => user.type === 'sso';

const _createUserByUsername = async (context, params) => {
  try {
    const USERNAME = params?.username;
    const NEW_USER = {
      _id: USERNAME,
      username: USERNAME,
      type: 'sso',
      accessGroupIds: ['default_ibm_sso_access_group'],
    };
    const CREATED_USER = await createOne(context, { value: NEW_USER });
    if (
      !lodash.isEmpty(CREATED_USER)
    ) {
      CREATED_USER.id = NEW_USER._id;
    }
    return CREATED_USER;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(_createUserByUsername.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const loginBySSO = async (
  context: IContextV1,
  params: {
    username?: any,
    externalAccessGroups?: any,
  },
) => {
  const CONTEXT_USER_ID = context?.user?.id;
  const PARAMS_USERNAME = params?.username;

  let user;
  try {
    if (
      lodash.isEmpty(PARAMS_USERNAME)
    ) {
      const ERROR_MESSAGE = `Missing required params.username parater!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    const DATASOURCE = getDatasourceV1App();
    user = await DATASOURCE.users.findOneByUsername(
      context,
      {
        username: PARAMS_USERNAME,
      }
    );
    if (
      lodash.isEmpty(user)
    ) {
      user = await _createUserByUsername(context, params);
    }
    if (
      !isSSO(user)
    ) {
      const ERROR_MESSAGE = `Wrong user type! ${user.type}`;
      throwAcaError(ACA_ERROR_TYPE.AUTHENTICATION_ERROR, MODULE_ID, ERROR_MESSAGE);
    }

    const CONFIGURATION = getLibConfiguration();
    const EXTERNAL_ACCESS_GROUP_SYNC_ENABLED = CONFIGURATION?.externalAccessGroupsSyncEnabled;

    if (
      EXTERNAL_ACCESS_GROUP_SYNC_ENABLED
    ) {
      await assignExternalAccessGroups(
        context,
        {
          user: user,
          externalAccessGroups: params?.externalAccessGroups,
        });
      logger.info('User external access groups synchronized!');
    } else {
      logger.info('User external access groups sync disabled!');
    }

    const AUTHORIZE_USER_PARAMS = {
      user: user,
      isLogin: true,
    };

    const RET_VAL = await authorizeUser(AUTHORIZE_USER_PARAMS);
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { CONTEXT_USER_ID, PARAMS_USERNAME });
    logger.error(loginBySSO.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
