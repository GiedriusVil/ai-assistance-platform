/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

// const { allowIfHasActionsPermissions } = require('@ibm-aiap/aiap-user-session-provider');

const { topicModelingController } = require('../controller');

const topicModelingRoutes = express.Router();

topicModelingRoutes.post(
  '/save-one',
  topicModelingController.saveOne
);
topicModelingRoutes.post(
  '/new-topic-modeling-job',
  topicModelingController.newTopicModelingJob
);
topicModelingRoutes.post(
  '/get-summary-by-query',
  topicModelingController.getSummaryByQuery
);
topicModelingRoutes.post(
  '/execute-job-by-id',
  topicModelingController.executeJobById
);
topicModelingRoutes.post(
  '/find-topics-by-job-id',
  topicModelingController.findTopicsByJobId
);
topicModelingRoutes.post(
  '/find-many-by-query',
  topicModelingController.findManyByQuery
);
topicModelingRoutes.post(
  '/find-one-by-id',
  topicModelingController.findOneById
);
topicModelingRoutes.post(
  '/delete-one-by-id',
  topicModelingController.deleteOneById
);
topicModelingRoutes.post(
  '/delete-many-by-ids',
  topicModelingController.deleteManyByIds
);

module.exports = {
  topicModelingRoutes,
};
