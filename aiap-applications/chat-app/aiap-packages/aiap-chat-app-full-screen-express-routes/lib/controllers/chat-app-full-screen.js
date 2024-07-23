/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aiap-chat-app-full-screen-express-routes-controllers-full-screen';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const chatAppFullScreen = (request, response) => {
  const PARAMS = request.query;

  const LANGUAGE = PARAMS.language;
  const ASSISTANT = PARAMS.assistantId;
  const ENGAGEMENT = PARAMS.engagementId;
  const TENANT = PARAMS.tenantId;
  
  const RENDER_OPTIONS = {
    language: LANGUAGE ?? 'en',
    assistantId: ASSISTANT,
    engagementId: ENGAGEMENT,
    tenantId: TENANT
  };

  logger.info('RENDER_OPTIONS', { RENDER_OPTIONS });
  response.render('chat-app-full-screen', RENDER_OPTIONS);
};

module.exports = {
  chatAppFullScreen,
};
