/*
  © Copyright IBM Corporation 2024. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aiap-middleware-client-profile-session`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import {
  formatIntoAcaError
} from '@ibm-aca/aca-utils-errors';


import {
  shouldSkipBySenderActionTypes,
} from '@ibm-aca/aca-utils-soe-middleware';

import {
  AbstractMiddleware,
  botStates,
  middlewareTypes,
} from '@ibm-aiap/aiap-soe-brain';

import {
  ISoeUpdateV1,
} from '@ibm-aiap/aiap--types-soe';

import {
  SoeBotV1,
} from '@ibm-aiap/aiap-soe-bot';

const removeDuplicates = (myArr, prop) => {
  return myArr.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};

class ClientProfileSessionWare extends AbstractMiddleware {
  constructor() {
    super(
      [botStates.NEW, botStates.UPDATE],
      'client-profile-session-ware',
      middlewareTypes.INCOMING
    );
  }

  __shouldSkip(context) {
    const PARAMS = {
      update: context?.update,
      skipSenderActionTypes: ['LOG_USER_ACTION'],
    };

    const IGNORE_BY_SENDER_ACTION_TYPE = shouldSkipBySenderActionTypes(PARAMS);

    if (IGNORE_BY_SENDER_ACTION_TYPE) {
      return true;
    }

    return false;
  }

  async executor(adapter: SoeBotV1, update: ISoeUpdateV1) {
    try {
      if (update.private && update.private.profile) {
        const profile = ramda.pathOr([], ['session', 'profile'], update);
        update.session.profile = removeDuplicates(
          profile.concat(update.private.profile),
          'key'
        );
      }
      if (update?.metadata?.metadata) {
        const metadata = ramda.pathOr([], ['session', 'metadata'], update);
        update.session.metadata = removeDuplicates(
          metadata.concat(update.metadata.metadata),
          'key'
        );
      }
      return;
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(`executor`, { ACA_ERROR });
      throw ACA_ERROR;
    }
  }
}

export {
  ClientProfileSessionWare
};
