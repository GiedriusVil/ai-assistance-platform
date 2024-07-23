/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-datasource-mongo-users-ensure-defaults';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const bcrypt = require('bcryptjs');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  IContextV1,
} from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  appendDataToError,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  findOneById,
} from '../find-one-by-id';

import {
  saveOne,
} from '../save-one';

import {
  DatasourceAppV1Mongo,
} from '../..';

const ensureDefault = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: {
    user: {
      username: any,
      password: any,
      accessGroupId: any,
    },
  },
) => {
  const CREATE_DATE = new Date().getTime();

  let password;
  let passwordEncrypted;

  let username;
  let accessGroupId;

  try {
    if (
      lodash.isEmpty(params?.user?.password)
    ) {
      const MESSAGE = `Missing required params.user.password parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    password = params?.user?.password;

    if (
      lodash.isEmpty(params?.user?.username)
    ) {
      const MESSAGE = `Missing required params.user.username parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    username = params?.user?.username;

    if (
      lodash.isEmpty(params?.user?.accessGroupId)
    ) {
      const MESSAGE = `Missing required params.user.accessGroupId parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }

    accessGroupId = params?.user?.accessGroupId;
    passwordEncrypted = bcrypt.hashSync(password, 10);
    const PARAMS = {
      id: username,
      value: {
        id: username,
        username: username,
        password: passwordEncrypted,
        accessGroupIds: [
          accessGroupId,
        ],
        timezone: 'Europe/Isle_of_Man',
        created: CREATE_DATE,
        updated: CREATE_DATE,
      }
    };

    const USER = await findOneById(datasource, context, PARAMS);
    const RET_VAL: any = { username };
    if (
      lodash.isEmpty(USER)
    ) {
      await saveOne(datasource, context, PARAMS);
      RET_VAL.status = 'CREATED';
    } else {
      RET_VAL.status = 'EXISTS';
    }
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    appendDataToError(ACA_ERROR, { username, accessGroupId });
    logger.error(ensureDefault.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export const ensureDefaults = async (
  datasource: DatasourceAppV1Mongo,
  context: IContextV1,
  params: {
    users: {
      [key: string]: {
        username: any,
        password: any,
        accessGroupId: any,
      }
    },
  }
) => {
  try {
    const PROMISES = [];
    if (
      !lodash.isEmpty(params?.users)
    ) {
      for (const USER_KEY of Object.keys(params?.users)) {
        if (
          !lodash.isEmpty(params?.users[USER_KEY])
        ) {
          PROMISES.push(ensureDefault(
            datasource,
            context,
            {
              user: params?.users[USER_KEY],
            }));
        }
      }
    }
    const RESULTS = await Promise.all(PROMISES);
    logger.info(`Ensured default users!`, {
      users: RESULTS
    });
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(ensureDefaults.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
