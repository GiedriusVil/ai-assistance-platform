/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const liveAnalyticsExportsRoutes = express.Router();

const { liveAnalyticsExportsController } = require('../../controller');

liveAnalyticsExportsRoutes.post('/export-one', liveAnalyticsExportsController.exportOne);


module.exports = liveAnalyticsExportsRoutes;
