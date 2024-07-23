/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import express from 'express';

const routes = express.Router();

import { authorizationRoutes } from './authorization';

routes.use('/authorize', authorizationRoutes);

export {
  routes,
};
