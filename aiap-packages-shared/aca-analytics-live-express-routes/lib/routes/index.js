/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const router = express.Router();

const { metricsRouter } = require('./metrics');
const { conversationsRouter } = require('./conversations');
const { dashboardsConfigurationsRouter } = require('./dashboards-configurations');
const { utterancesRouter } = require('./utterances');
const { messagesRouter } = require('./messages');
const { feedbacksRouter } = require('./feedbacks');
const { usageByGroupRouter } = require('./usage-by-group');
const { usersRouter } = require('./users');
const { surveysRouter } = require('./surveys');

router.use(
  '/metrics',
  allowIfHasPagesPermissions('LiveMetricsView'),
  metricsRouter,
);
router.use(
  '/dashboards-configurations',
  allowIfHasPagesPermissions('LiveMetricsConfigurationView'),
  dashboardsConfigurationsRouter
);
router.use(
  '/conversations',
  allowIfHasPagesPermissions('LiveMetricsView'),
  conversationsRouter
);
router.use(
  '/utterances',
  allowIfHasPagesPermissions('LiveMetricsView'),
  utterancesRouter
);
router.use(
  '/messages',
  allowIfHasPagesPermissions('LiveMetricsView'),
  messagesRouter);
router.use(
  '/feedbacks',
  allowIfHasPagesPermissions('LiveMetricsView'),
  feedbacksRouter
);
router.use(
  '/usage-by-group',
  allowIfHasPagesPermissions('LiveMetricsView'),
  usageByGroupRouter
);
router.use(
  '/users',
  allowIfHasPagesPermissions('LiveMetricsView'),
  usersRouter
);
router.use(
  '/surveys',
  allowIfHasPagesPermissions('LiveMetricsView'),
  surveysRouter
);

module.exports = {
  router,
}
