/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import compileLambdaModules from './lambda-modules';
import feedbacks from './feedbacks/index';
import surveys from'./surveys/index';
import transcripts from'./transcripts';
import speech from'./speech/speech';
import config from'./config';
import jwt from'./jwt/jwt';
import environment from'./environment/environment';
import staticEngagement from'./static';
import customCss from'./custom-css';
import widget from'./get-widget';
import widgetButton from'./get-widget-button';
import widgetDefault from'./get-widget-default';
import deprecated from './deprecated';
import file from './file';

import chatAppVersion from'./get-chat-app-version';

export default {
  compileLambdaModules,
  environment,
  feedbacks,
  surveys,
  transcripts,
  speech,
  config,
  jwt,
  staticEngagement,
  customCss,
  widget,
  widgetButton,
  widgetDefault,
  deprecated,
  chatAppVersion,
  file
};
