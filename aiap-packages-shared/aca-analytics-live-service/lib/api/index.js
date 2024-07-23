/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const conversationsService = require('./conversations');
const dashboardsConfigurationsService = require('./dashboards-configurations');
const usageByGroupService = require('./usage-by-group');
const feedbacksService = require('./feedbacks');
const messagesService = require('./messages');
const metricsService = require('./metrics');
const surveysService = require('./surveys');
const usersService = require('./users');
const utterancesService = require('./utterances');

module.exports = {
  conversationsService,
  dashboardsConfigurationsService,
  usageByGroupService,
  feedbacksService,
  messagesService,
  metricsService,
  surveysService,
  usersService,
  utterancesService,
}
