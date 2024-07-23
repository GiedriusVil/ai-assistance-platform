/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router({ mergeParams: true });

const { dashboardsConfigurationsController } = require('../../controller');

routes.get('/', dashboardsConfigurationsController.exportMany);

module.exports = routes;
