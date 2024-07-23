/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import express from 'express';
import path from'path';
import controllers from './controllers';

const apiContextRouter = express.Router();
const contextRouter = express.Router();

apiContextRouter.post('/lambda-modules/compile', controllers.compileLambdaModules.compile);
apiContextRouter.post('/feedbacks', controllers.feedbacks.saveOne);
apiContextRouter.post('/surveys', controllers.surveys.saveOne);
apiContextRouter.post('/environments', controllers.environment.submitEnvironment);
apiContextRouter.post('/speech/token', controllers.speech.getToken);
apiContextRouter.post('/speech/audio', controllers.speech.getAudio);
apiContextRouter.post('/transcripts/download-one', controllers.transcripts.downloadOne);
apiContextRouter.post('/transcripts/transform/test-case', controllers.transcripts.transformOne);
apiContextRouter.get('/config', controllers.config.getConfig);
apiContextRouter.get('/full-config', controllers.config.getFullConfig);
apiContextRouter.get('/file/:tenantId/:bucketRef/:fileRef', controllers.file.retrieveObjectStorageFile);
apiContextRouter.post('/verify', controllers.jwt.verify);

contextRouter.use('/', express.static(path.join(__dirname, '../../../../../client/dist/client-v1')));
contextRouter.use('/', express.static(path.join(__dirname, '../../../../../client/dist/client-widget')));
contextRouter.use('/client-wbc', express.static(path.join(__dirname, '../../../../../client-wbc/dist')));
contextRouter.use('/wbc-chat-app', express.static(path.join(__dirname, '../../../../../client/dist/client-v2')));
contextRouter.use('/wbc-chat-app-v3', express.static(path.join(__dirname, '../../../../../client/dist/client-v3')));

contextRouter.use('/wbc-chat-app-button', express.static(path.join(__dirname, '../../../../../client-wbc/dist/aca-wbc-chat-app-button')));

contextRouter.use('/api/v1', apiContextRouter);

contextRouter.use('/get-widget-button', controllers.widgetButton.getWidgetButton);
contextRouter.use('/get-wbc-chat-app-button-options', controllers.staticEngagement.wbcChatAppButtonEngagement);

// [jg] TODO this will replace the below 3 scripts once migration to wbc-chat-app-button is done
// contextRouter.use('/get-widget', controllers.widget.getWidget);
// contextRouter.use('/get-widget-default', controllers.widgetDefault.getWidgetDefault);
// contextRouter.use('/get-widget-options', controllers.staticEngagement.getWidgetOptions);

contextRouter.use('/chat-app-version', controllers.chatAppVersion.getChatAppVersion);
// [jg] TODO remove those temp paths after migration to wbc-chat-app-button is done
contextRouter.use('/v1/get-widget', controllers.widget.getWidget);
contextRouter.use('/v1/get-widget-default', controllers.widgetDefault.getWidgetDefault);
contextRouter.use('/v1/get-widget-options', controllers.staticEngagement.getWidgetOptions);

// [jg] TODO setting temporary deprecated paths to return empty js scripts. To be replaced once migration to wbc-chat-app-button is done
contextRouter.use('/get-widget', controllers.widgetButton.getWidgetButton);
contextRouter.use('/get-widget-default', controllers.deprecated.getDeprecated);
contextRouter.use('/get-widget-options', controllers.deprecated.getDeprecated);

contextRouter.use('/static/:engagement/:fileName', controllers.staticEngagement.staticEngagement);
contextRouter.use('/wbc-chat-app/static/:engagement/:fileName', controllers.staticEngagement.wbcChatAppStaticEngagement);
contextRouter.use('/style/:engagementId/:tenantId/:tenantHash/:assistantId/:fileName', controllers.customCss.customCss);
contextRouter.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../../client/dist/client-v1/index.html'));
});

export {
  contextRouter,
};
