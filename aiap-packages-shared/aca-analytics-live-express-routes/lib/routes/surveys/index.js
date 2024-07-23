/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const surveysRouter = express.Router();

const { surveysController } = require('../../controller');

surveysRouter.post('/find-positive-surveys-by-query-month-groups', surveysController.findPositiveSurveysByQueryMonthGroups);
surveysRouter.post('/find-positive-surveys-target-by-query-month-groups', surveysController.findPositiveSurveysTargetByQueryMonthGroups);

module.exports = {
  surveysRouter,
}
