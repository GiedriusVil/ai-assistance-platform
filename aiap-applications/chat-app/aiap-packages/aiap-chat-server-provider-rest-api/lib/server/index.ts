/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-chat-rest-server';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import lodash from '@ibm-aca/aca-wrapper-lodash';
import ramda from '@ibm-aca/aca-wrapper-ramda';
import bodyParser from 'body-parser';

import {
  formatIntoAcaError,
  appendDataToError,
  throwAcaError,
  ACA_ERROR_TYPE
} from '@ibm-aca/aca-utils-errors';

import { ChatServerV1 } from '@ibm-aiap/aiap-chat-app--types';

import {
  getChatRestSessionProvider
} from '../session-provider-registry';

import {
  processIncomingMessage
} from '../processor-incoming-message';

class AiapChatRestV1Server extends ChatServerV1 {

  routes: any;
  configuration: any;
  messagesPath: string;
  constructor(routes, configuration) {
    super()
    try {
      if (
        !routes
      ) {
        const MESSAGE = `Initialize routes object first!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
      }
      this.routes = routes;
      this.setConfiguration(configuration);
    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      appendDataToError(ACA_ERROR, { configuration });
      throw ACA_ERROR;
    }
  }

  setConfiguration(configuration) {
    const TENANT_ID = configuration?.tenant?.id;
    const ENGAGEMENT_ID = configuration?.engagement?.id;
    const ASSISTANT_ID = configuration?.assistant?.id;

    if (
      lodash.isEmpty(TENANT_ID)
    ) {
      const MESSAGE = `Missing required configuration.tenant.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ENGAGEMENT_ID)
    ) {
      const MESSAGE = `Missing required configuration.engagement.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }
    if (
      lodash.isEmpty(ASSISTANT_ID)
    ) {
      const MESSAGE = `Missing required configuration.assistant.id attribute!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
    }

    this.configuration = configuration;
  }

  async initialise() {
    const TENANT_ID = this.configuration?.tenant?.id;
    const ENGAGEMENT_ID = this.configuration?.engagement?.id;
    const ASSISTANT_ID = this.configuration?.assistant?.id;

    const MESSAGES_PATH = `/${TENANT_ID}/${ENGAGEMENT_ID}/${ASSISTANT_ID}`;
    if (MESSAGES_PATH !== this.messagesPath) {
      this.messagesPath = MESSAGES_PATH;
      this.routes.use(bodyParser.json());
      this.routes.use(bodyParser.urlencoded({ extended: true }));
      this.routes.post(`${MESSAGES_PATH}/message/v1/workspaces/:workspaceId/message`, async (req, res) => this.postMessage(req, res));
    }
  }

  async postMessage(req, res) {
    let chatRestSessionProvider;
    const ERRORS = [];
    const BODY = req?.body;
    const MESSAGE = BODY?.input;
    const CLIENT_USER_ID = BODY?.context?.metadata?.user_id;
    const G_ACA_PROPS_TENANT_ID = this.configuration?.tenant?.id;
    const G_ACA_PROPS_ENGAGEMENT_ID = this.configuration?.engagement?.id;
    const G_ACA_PROPS_ASSISTANT_ID = this.configuration?.assistant?.id;


    console.log('Incoming REST Message', {
      body: BODY,
      input: BODY?.input,
      context: BODY?.context
    })

    console.log('Incoming REST Message', {
      body: BODY,
      input: JSON.stringify(BODY?.input),
      context: JSON.stringify(BODY?.context)
    })

    try {

      if (
        lodash.isEmpty(CLIENT_USER_ID)
      ) {
        const MESSAGE = `Missing required body.context.user.id attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(MESSAGE)
      ) {
        const MESSAGE = `Missing required body.input attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(G_ACA_PROPS_TENANT_ID)
      ) {
        const MESSAGE = `Missing required body.gAcaProps.tenantId attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(G_ACA_PROPS_ENGAGEMENT_ID)
      ) {
        const MESSAGE = `Missing required body.gAcaProps.engagementId attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }
      if (
        lodash.isEmpty(G_ACA_PROPS_ASSISTANT_ID)
      ) {
        const MESSAGE = `Missing required body.gAcaProps.assistantId attribute!`;
        throwAcaError(MODULE_ID, ACA_ERROR_TYPE.INITIALIZATION_ERROR, MESSAGE);
      }

      const SESSION_PROVIDER_PARAMS = {
        userId: CLIENT_USER_ID,
        server: this,
        tenantId: G_ACA_PROPS_TENANT_ID,
        assistantId: G_ACA_PROPS_ASSISTANT_ID,
        engagementId: G_ACA_PROPS_ENGAGEMENT_ID,
      };
      chatRestSessionProvider = await getChatRestSessionProvider(SESSION_PROVIDER_PARAMS);

      const PROCESS_INCOMING_MESSAGE_PARAMS = {
        response: res,
        body: BODY
      }
      await processIncomingMessage(chatRestSessionProvider, PROCESS_INCOMING_MESSAGE_PARAMS);

    } catch (error) {
      const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
      ERRORS.push(ACA_ERROR?.message);
      logger.error(`postMessage`, { ERRORS });
    }
  }
}


export {
  AiapChatRestV1Server,
}
