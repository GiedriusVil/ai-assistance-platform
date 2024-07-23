/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import express from 'express';
import { healthRoutes } from './health';

const routes = express.Router();

routes.use('/health', healthRoutes);

export {
  routes,
}
