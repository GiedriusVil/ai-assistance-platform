/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const dashboardsConfigurationsRouter = express.Router();

const { dashboardsConfigurationsController } = require('../../controller');

dashboardsConfigurationsRouter.post('/delete-many-by-ids', dashboardsConfigurationsController.deleteManyByIds);
dashboardsConfigurationsRouter.post('/find-many-by-query', dashboardsConfigurationsController.findManyByQuery);
dashboardsConfigurationsRouter.get('/find-one-by-dashboard-name/:dashboard', dashboardsConfigurationsController.findOneByDashboardName);
dashboardsConfigurationsRouter.get('/find-one-by-id/:configurationId', dashboardsConfigurationsController.findOneById);
dashboardsConfigurationsRouter.post('/save-one', dashboardsConfigurationsController.saveOne);

module.exports = {
  dashboardsConfigurationsRouter
}
