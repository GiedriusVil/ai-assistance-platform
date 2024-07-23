/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'soe-server-botmaster-register-inc-middlewares';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';

import { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } from '@ibm-aca/aca-utils-errors';

import { TraceIncomingWare } from '@ibm-aiap/aiap-middleware-trace';
import {
  DataMaskingWare,
} from '@ibm-aiap/aiap-middleware-data-masking';
import {
  MsTeamsSurveyLoggerWare,
  MsTeamsTenantHashWare,
} from '@ibm-aca/aca-middleware-microsoft-adapter';

import { WaitWare } from '@ibm-aca/aca-middleware-wait';
import { SessionIncomingWare } from '@ibm-aiap/aiap-middleware-session';
import { ConversationStatusWare } from '@ibm-aca/aca-middleware-conversation-status';
import { ClientMetadataToContextWare } from '@ibm-aiap/aiap-middleware-client-metadata';
import { ContextVarToggleWare } from '@ibm-aiap/aiap-middleware-context-var-toggle';
import { MaskPinHandlerWare } from '@ibm-aca/aca-middleware-mask-pin-handler';
import { ContextWare } from '@ibm-aiap/aiap-middleware-context';
import { ReconnectionCheckWare } from '@ibm-aiap/aiap-middleware-reconnection-check';
import { RetryTagHandlerWare } from '@ibm-aiap/aiap-middleware-retry-tag-handler';
import { ClientProfileSessionWare } from '@ibm-aiap/aiap-middleware-client-profile-session';
import { ClientProfileContextWare } from '@ibm-aiap/aiap-middleware-client-profile-context';
import { UpdateSessionContextWare } from '@ibm-aca/aca-middleware-update-session-context';
import { IncomingRequestWare } from '@ibm-aca/aca-middleware-incoming-request';
import { LangIdentificationWare } from '@ibm-aca/aca-middleware-lang-identification';
import { LangTranslationWare } from '@ibm-aca/aca-middleware-lang-translation';
import {
  AnalyticsConversationLoggerWareIncoming,
  AnalyticsUtteranceLoggerWare,
  AnalyticsUserMessageLoggerWare,
} from '@ibm-aiap/aiap-middleware-analytics';
import { AiServiceEnsureDefaultWare } from '@ibm-aiap/aiap-middleware-ai-service-ensure-default';
import { ContextRestoreWare } from '@ibm-aiap/aiap-middleware-context-restore';
import {
  ClassifierIncomingWare,
} from '@ibm-aiap/aiap-middleware-classifier';
import {
  AiServiceWare,
  AiServiceChangeActionV2,
  AiServiceChangeAction,
} from '@ibm-aiap/aiap-middleware-ai-service';
import { AiServiceChangeLoopHandlerWare } from '@ibm-aiap/aiap-middleware-ai-service-change-loop-handler';
import { MessageSourceDetectionWare } from '@ibm-aca/aca-middleware-message-source-detection';
import { LastContextWare } from '@ibm-aca/aca-middleware-last-context';
import { LastStateWare } from '@ibm-aca/aca-middleware-last-state';
import { ButtonSkipWare } from '@ibm-aiap/aiap-middleware-button-skip';
import { GreetingManagerWare } from '@ibm-aca/aca-middleware-greeting-manager';
import { VirtualAssistantsIncomingWare } from '@ibm-aca/aca-middleware-virtual-assistants';
import { MessageOutgoingEmitterWare } from '@ibm-aiap/aiap-middleware-message-outgoing-emitter';

const registerIncMiddlewares = (context, params) => {
  let configuration;
  let botmaster;

  let actions;
  try {
    configuration = params?.configuration;
    botmaster = params?.botmaster;
    actions = params?.actions
    if (
      lodash.isEmpty(botmaster)
    ) {
      const ERROR_MESSAGE = `Missing required params.botmaster`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, ERROR_MESSAGE);
    }

    botmaster.use(new TraceIncomingWare().middleware());
    botmaster.use(new DataMaskingWare(configuration).middleware());

    if (
      configuration.acaAdapterMicrosoft
    ) {
      botmaster.use(new MsTeamsTenantHashWare().middleware());
      botmaster.use(new MsTeamsSurveyLoggerWare().middleware());
    }

    botmaster.use(new WaitWare(configuration).middleware());
    botmaster.use(new SessionIncomingWare().middleware());
    botmaster.use(new ConversationStatusWare().middleware());
    botmaster.use(new ClientMetadataToContextWare().middleware());
    botmaster.use(new ContextVarToggleWare(configuration).middleware());
    botmaster.use(new MaskPinHandlerWare(configuration).middleware());
    botmaster.use(new ContextWare().middleware());
    botmaster.use(new ReconnectionCheckWare().middleware());
    botmaster.use(new RetryTagHandlerWare().middleware());
    botmaster.use(new ClientProfileSessionWare().middleware());
    botmaster.use(new ClientProfileContextWare().middleware());
    botmaster.use(new UpdateSessionContextWare().middleware());
    botmaster.use(new IncomingRequestWare().middleware());
    botmaster.use(new LangIdentificationWare().middleware());
    botmaster.use(new LangTranslationWare().middleware());

    botmaster.use(new AnalyticsConversationLoggerWareIncoming(configuration).middleware());
    botmaster.use(new AnalyticsUserMessageLoggerWare(configuration).middleware());

    botmaster.use(new AiServiceEnsureDefaultWare().middleware());
    botmaster.use(new ContextRestoreWare().middleware());

    botmaster.use(new ClassifierIncomingWare().middleware());

    botmaster.use(new AiServiceWare().middleware());

    botmaster.use(new AiServiceChangeLoopHandlerWare().middleware());

    actions.aiServiceChangeActionV2 = AiServiceChangeActionV2();
    actions.aiServiceChangeAction = AiServiceChangeAction();
    actions.changeWA = actions.aiServiceChangeAction;

    botmaster.use(new MessageSourceDetectionWare({ messages: [] }).middleware());
    botmaster.use(new LastStateWare({ ignoreTagChecks: { fail: true } }).middleware());
    botmaster.use(new LastContextWare({ ignoreTagChecks: { fail: true } }).middleware());
    botmaster.use(new AnalyticsUtteranceLoggerWare(configuration).middleware());

    if (
      configuration.concierge &&
      configuration.concierge.isActive
    ) {
      botmaster.use(new ButtonSkipWare().middleware());
    }

    botmaster.use(new GreetingManagerWare().middleware());

    if (
      configuration.amazonAlexa || configuration.googleAssistant
    ) {
      botmaster.use(new VirtualAssistantsIncomingWare(configuration).middleware());
    }

    botmaster.use(new MessageOutgoingEmitterWare().middleware());
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(registerIncMiddlewares.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

export {
  registerIncMiddlewares,
}
