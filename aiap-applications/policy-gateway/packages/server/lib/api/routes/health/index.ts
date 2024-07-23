/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import express from 'express';
const healthRoutes = express.Router();

import { retrieveHealthCheckInfo } from './controllers';

healthRoutes.get('/', retrieveHealthCheckInfo);

export {
  healthRoutes,
};
