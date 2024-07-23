/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const conversationsController = require('./conversations');
const dashboardsConfigurationsController = require('./dashboards-configurations');
const usageByGroupController = require('./usage-by-group');
const feedbacksController = require('./feedbacks');
const messagesController = require('./messages');
const metricsController = require('./metrics');
const surveysController = require('./surveys');
const usersController = require('./users');
const utterancesController = require('./utterances');

module.exports = {
  conversationsController,
  dashboardsConfigurationsController,
  usageByGroupController,
  feedbacksController,
  messagesController,
  metricsController,
  surveysController,
  usersController,
  utterancesController,
}
