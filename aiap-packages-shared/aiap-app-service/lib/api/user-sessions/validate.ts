/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'app-service-user-sessions-validate';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import { IContextV1 } from '@ibm-aiap/aiap--types-server';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  getDatasourceV1App,
} from '@ibm-aiap/aiap-app-datasource-provider';

export const validate = async (
  context: IContextV1,
  params: {
    user: {
      id: any,
      username: any,
    },
    token: any,
  },
) => {
  try {
    if (
      lodash.isEmpty(params?.user?.id)
    ) {
      const MESSAGE = `Missing required params.user.id parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(params?.user?.username)
    ) {
      const MESSAGE = `Missing required params.user.username parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
    }
    const DATASOURCE = getDatasourceV1App();
    const EXISTING_USER = await DATASOURCE.users.findOneById(context, { id: params?.user?.id });
    if (
      lodash.isEmpty(EXISTING_USER)
    ) {
      const MESSAGE = `Unable to find the user!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHENTICATION_ERROR, MESSAGE);
    }

    const INCOMING_TOKEN = params?.token;
    const EXISTING_TOKEN = EXISTING_USER?.token;

    if (
      INCOMING_TOKEN != EXISTING_TOKEN
    ) {
      const ERROR_MESSAGE = `User token mismatch!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.AUTHENTICATION_ERROR, ERROR_MESSAGE);
    }
    return params?.user;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(validate.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}
