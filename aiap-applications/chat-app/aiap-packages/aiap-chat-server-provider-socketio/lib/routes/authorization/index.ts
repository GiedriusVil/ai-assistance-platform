/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import express from 'express';

import { authorizationController } from '../../controllers';

const authorizationRoutes = express.Router();

authorizationRoutes.post('/session', authorizationController.authorize);

export {
  authorizationRoutes,
};
