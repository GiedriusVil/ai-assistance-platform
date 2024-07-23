/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'soe-server-botmaster';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

import ramda from '@ibm-aca/aca-wrapper-ramda';

import { formatIntoAcaError } from '@ibm-aca/aca-utils-errors';
import { Botmaster } from '@ibm-aiap/aiap-soe-engine';

import { BrainStatus, errorHandler } from '@ibm-aiap/aiap-soe-brain';

import { getMemoryStore } from '@ibm-aiap/aiap-memory-store-provider';

import { attachBot2Botmaster as attachBotRestApi2Botmaster } from '@ibm-aiap/aiap-soe-bot-rest-api';
import { attachBot2Botmaster as attachBotSocketIo2Botmaster } from '@ibm-aiap/aiap-soe-bot-socketio';

import { MicrosoftAdapter } from '@ibm-aca/aca-adapter-microsoft';

import { registerIncMiddlewares } from './register-inc-middlewares';
import { registerOutMiddlewares } from './register-out-middlewares';

import actions from '@ibm-aca/aca-common-botmaster-actions';
import actionsCommon from '@ibm-aca/aca-common-actions';

import { wdsAction } from '@ibm-aca/aca-watson-discovery-service';
const { wiki, flights, SendEmailAction } = actions;

const setupBotmaster = async (context, params) => {
  let configuration;
  let server;
  let app;

  let brainStatus;

  let botmasterSettings;
  let botmaster;

  let sessionStore;
  try {
    configuration = params?.configuration;
    server = params?.server;
    app = params?.app;

    brainStatus = new BrainStatus();

    botmasterSettings = { server };
    botmaster = new Botmaster(botmasterSettings);

    sessionStore = getMemoryStore();

    await attachBotSocketIo2Botmaster({
      sessionStorage: sessionStore,
      server: server,
      botmaster: botmaster,
    });

    await attachBotRestApi2Botmaster({
      sessionStorage: sessionStore,
      server: server,
      botmaster: botmaster,
    });

    if (configuration.acaAdapterMicrosoft) {
      logger.info('[ENGINE][SETUP] Enabling ACA Microsoft Adapter');
      const microsoftBot = new MicrosoftAdapter(configuration, app, sessionStore, server);
      botmaster.addBot(microsoftBot);
    }

    // Common Actions Implementation (aca-common-actions)
    actions.image = actionsCommon.image();
    actions.file = actionsCommon.file();
    actions.video = actionsCommon.video();
    actions.audio = actionsCommon.audio();
    actions.link = actionsCommon.link();
    actions.carousel = actionsCommon.carousel();
    actions.feedback = actionsCommon.feedback();
    actions.form = actionsCommon.form();
    actions.quickReply = actionsCommon.quickReply();
    actions.list = actionsCommon.list();
    actions.card = actionsCommon.card();
    actions.table = actionsCommon.table;
    actions.datePicker = actionsCommon.datePicker;

    // set up incoming ware
    registerIncMiddlewares({}, { configuration, actions, botmaster, sessionStore });

    if (
      configuration.wds
    ) {
      actions.wds = wdsAction(configuration.wds);
    }

    actions.close = actions.close();
    actions.retryTag = actions.retryTag();
    actions.PIIMasking = actions.PIIMasking();

    if (
      configuration.wiki
    ) {
      actions.wiki = wiki(configuration);
    }

    if (
      configuration.flights
    ) {
      actions.flights = flights(configuration);
    }

    if (
      configuration.mailServer
    ) {
      actions.sendEmail = SendEmailAction(configuration, sessionStore);
    }

    registerOutMiddlewares({}, { configuration, sessionStore, botmaster, actions });

    botmaster.on('error', errorHandler(configuration.error));

    const RET_VAL = {
      status: brainStatus.status.bind(brainStatus),
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    throw ACA_ERROR;
  }
};

export {
  setupBotmaster,
}
