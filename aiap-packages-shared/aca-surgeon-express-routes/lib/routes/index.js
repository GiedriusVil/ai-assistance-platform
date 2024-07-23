/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { availableApisRoutes } = require('./available-apis');
const { mongoClientsRoutes } = require('./mongo-clients');
const { datasourcesRoutes } = require('./datasources');
const { redisClientsRoutes } = require('./redis-clients');
const { eventStreamsRoutes } = require('./event-streams');
const { tenantEventStreamHandlersRoutes } = require('./tenant-event-stream-handlers');
const { lambdaModulesRoutes } = require('./lambda-modules');
const { liveAnalyticsQieriesRoutes } = require('./live-analytics-queries');
const { fulFillWareActionsRoutes } = require('./ful-fill-ware-actions');

routes.use('/available-apis', availableApisRoutes);
routes.use('/mongo-clients', mongoClientsRoutes);
routes.use('/datasources', datasourcesRoutes);
routes.use('/redis-clients', redisClientsRoutes);
routes.use('/event-streams', eventStreamsRoutes);
routes.use('/tenant-event-stream-handlers', tenantEventStreamHandlersRoutes);
routes.use('/lambda-modules', lambdaModulesRoutes);
routes.use('/live-analytics-queries', liveAnalyticsQieriesRoutes);
routes.use('/ful-fill-ware-actions', fulFillWareActionsRoutes);

module.exports = routes;
