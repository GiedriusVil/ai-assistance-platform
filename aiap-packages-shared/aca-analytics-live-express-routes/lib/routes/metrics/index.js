/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const metricsRouter = express.Router();

const { metricsController } = require('../../controller');

metricsRouter.post('/', metricsController.retrieveMetrics);

metricsRouter.post('/conversations-count-by-query', metricsController.conversationsCountByQuery);

metricsRouter.post('/messages-action-needed-count-by-query', metricsController.messagesCountByQuery);
metricsRouter.post('/messages-count-by-query', metricsController.messagesCountByQuery);
metricsRouter.post('/messages-avg-per-conversation-by-query', metricsController.messagesAvgPerConversationsByQuery);
metricsRouter.post('/messages-false-positive-count-by-query', metricsController.messagesFalsePositiveCountByQuery);
metricsRouter.post('/messages-false-positive-percentage-by-query', metricsController.messagesFalsePositivePercentageByQuery);

metricsRouter.post('/utterances-action-needed-count-by-query', metricsController.utterancesActionNeededCountByQuery);
metricsRouter.post('/utterances-avg-per-conversation-by-query', metricsController.utterancesAvgPerConversationsByQuery);
metricsRouter.post('/utterances-count-by-query', metricsController.utterancesCountByQuery);
metricsRouter.post('/utterances-false-positive-count-by-query', metricsController.utterancesFalsePositiveCountByQuery);
metricsRouter.post('/utterances-false-positive-percentage-by-query', metricsController.utterancesFalsePositivePercentageByQuery);
metricsRouter.post('/utterances-transfers-count-by-query', metricsController.utterancesTransfersCountByQuery);
metricsRouter.post('/utterances-transfers-percentage-by-query', metricsController.utterancesTransfersPercentageByQuery);

module.exports = {
  metricsRouter,
}
