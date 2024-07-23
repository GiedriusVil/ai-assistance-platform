/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const metricsRoutes = express.Router();

const { purchaseRequestsController } = require('../controller');

metricsRoutes.post('/purchase-requests/find-many-by-query', purchaseRequestsController.findManyByQuery);
metricsRoutes.post('/purchase-requests/calculations', purchaseRequestsController.retrieveMetrics);
metricsRoutes.post('/purchase-requests/count-by-validations', purchaseRequestsController.countByValidations);
metricsRoutes.post('/purchase-requests/count-by-day', purchaseRequestsController.countByDay);
metricsRoutes.post('/purchase-requests/validation-frequency', purchaseRequestsController.validationFrequency);

module.exports = {
   metricsRoutes,
};
