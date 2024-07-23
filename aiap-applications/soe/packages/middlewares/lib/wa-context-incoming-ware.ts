/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'middleware-wa-context-incoming-ware';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import { AbstractMiddleware, botStates, middlewareTypes } from '@ibm-aiap/aiap-soe-brain';

import { setUpdateSessionContextAttribute, getUpdateSessionContextAttribute } from '../../../aiap-packages/aiap-utils-soe-update';
import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';

class WaContextIncomingWare extends AbstractMiddleware {

  path: any;
  message: any;

  constructor(message, path) {
    super(
      [
        botStates.NEW, botStates.UPDATE, botStates.INTERNAL_UPDATE, botStates.MONITOR
      ],
      'wa-context-incoming-ware',
      middlewareTypes.INCOMING
    );
    this.message = message;
    this.path = path;
  }

  async executor(
    bot,
    update,
    next,
  ) {
    const CONFIRMATIONS = ramda.path(['confirmations'], update);
    const SENDER_ACTION = ramda.path(['message', 'sender_action'], update);
    const G_ACA_PROPS = ramda.path(['gAcaProps'], update);
    const ENGAGEMENT = ramda.path(['engagement'], update);

    const G_ACA_PROPS_COPY = lodash.cloneDeep(G_ACA_PROPS);
    delete G_ACA_PROPS_COPY.user;
    delete G_ACA_PROPS_COPY.userProfile;
    const G_ACA_PROPS_USER = ramda.path(['user'], G_ACA_PROPS);
    const G_ACA_PROPS_USER_PROFILE = ramda.path(['userProfile'], G_ACA_PROPS);
    try {
      let PRIVATE = getUpdateSessionContextAttribute(update, 'private');
      PRIVATE = lodash.defaultTo(PRIVATE, {});
      if (
        !lodash.isEmpty(G_ACA_PROPS_USER)
      ) {
        PRIVATE.user = G_ACA_PROPS_USER;
      }
      if (
        !lodash.isEmpty(G_ACA_PROPS_USER_PROFILE)
      ) {
        PRIVATE.userProfile = G_ACA_PROPS_USER_PROFILE;
      }
      setUpdateSessionContextAttribute(update, 'private', PRIVATE)
      setUpdateSessionContextAttribute(update, 'gAcaProps', G_ACA_PROPS);
      setUpdateSessionContextAttribute(update, 'confirmations', CONFIRMATIONS);
      setUpdateSessionContextAttribute(update, 'sender_action', SENDER_ACTION);
      setUpdateSessionContextAttribute(update, 'engagement', ENGAGEMENT);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      logger.error(this.executor.name, { ACA_ERROR });
    }
    next();
  }
}

export {
  WaContextIncomingWare,
}
