/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import express from 'express';
const routes = express.Router();

const controllers = require('../controllers');

routes.post('/health', controllers.retrieveHealth);
routes.post('/performance/summary', controllers.getRequestPerformanceSummary);

export {
  routes,
}
