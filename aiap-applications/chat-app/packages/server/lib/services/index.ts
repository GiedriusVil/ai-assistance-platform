/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import feedbacksService from'./feedbacks';
import surveyService from './surveys';
import transcriptsService from './transcripts';
import userService from './user';
import lambdaModuleService from './lambda/modules';

export {
  lambdaModuleService,
  feedbacksService,
  surveyService,
  transcriptsService,
  userService,
};
