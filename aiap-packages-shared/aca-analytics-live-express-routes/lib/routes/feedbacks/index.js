/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const feedbacksRouter = express.Router();

const { feedbacksController } = require('../../controller');

feedbacksRouter.get('/positive-and-negative-feedbacks', feedbacksController.positiveAndNegativeFeedbacks);
feedbacksRouter.post('/find-positive-feedbacks-by-query-month-groups', feedbacksController.findPositiveFeedbacksByQueryMonthGroups);
feedbacksRouter.post('/find-positive-feedbacks-target-by-query-month-groups', feedbacksController.findPositiveFeedbacksTargetByQueryMonthGroups);

module.exports = {
  feedbacksRouter,
}
