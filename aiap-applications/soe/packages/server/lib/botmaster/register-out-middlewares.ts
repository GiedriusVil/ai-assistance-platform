/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'soe-server-botmaster-register-out-middlewares';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';
import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  ACA_ERROR_TYPE,
  formatIntoAcaError,
  throwAcaError,
} from '@ibm-aca/aca-utils-errors';

import actionsBotmaster from '@ibm-aca/aca-botmaster-fulfill-actions';

import { TraceOutgoingWare } from '@ibm-aiap/aiap-middleware-trace';
import { TagReplaceWare } from '@ibm-aca/aca-middleware-tag-replace';
import { StructuredMessageWare } from '@ibm-aca/aca-middleware-structured-message';
const { createButtons } = require('@ibm-aca/aca-structured-content-liveperson').v2;
import { FulfillWare, actionsNativeRegistry } from '@ibm-aca/aca-middleware-fulfill';
import { SessionOutgoingWare } from '@ibm-aiap/aiap-middleware-session';
import { DelayWare } from '@ibm-aca/aca-middleware-delay';
import { MessageLoggerWare } from '@ibm-aca/aca-middleware-message-logger';
import {
  AnalyticsConversationLoggerWareOutgoing,
  AnalyticsBotMessageLoggerWare,
} from '@ibm-aiap/aiap-middleware-analytics';

// TODO -> Dedicate separate librarys
// import { BasketOutgoingMiddleware } from '@custom/middlewares';

const registerOutMiddlewares = (context, params) => {
  let configuration;
  let sessionStore;
  let botmaster;

  let actions;

  try {
    configuration = params?.configuration;
    sessionStore = params?.sessionStore;
    botmaster = params?.botmaster;
    actions = params?.actions;

    if (
      lodash.isEmpty(botmaster)
    ) {
      const ERROR_MESSAGE = `Missing required params.botmaster`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    botmaster.use(new TraceOutgoingWare().middleware());
    botmaster.use(new TagReplaceWare().middleware());
    botmaster.use(new StructuredMessageWare(createButtons, true).middleware());

    const FULL_FILL_ACTIONS = lodash.merge(actions, actionsBotmaster);

    const FULL_FILL_PARAMS = {
      sessionStore: sessionStore,
      config: configuration,
    };

    actionsNativeRegistry.loadMany(FULL_FILL_ACTIONS);
    botmaster.use(FulfillWare(FULL_FILL_PARAMS));

    botmaster.use(new SessionOutgoingWare(configuration).middleware());
    botmaster.use(new DelayWare(configuration).middleware());
    botmaster.use(new MessageLoggerWare().middleware());
    botmaster.use(new AnalyticsBotMessageLoggerWare(configuration).middleware());
    botmaster.use(new AnalyticsConversationLoggerWareOutgoing(configuration).middleware());


    // botmaster.use(new BasketOutgoingMiddleware(configuration).middleware());  // TODO fix issue with middleware

  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(registerOutMiddlewares.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

}

export {
  registerOutMiddlewares,
}
