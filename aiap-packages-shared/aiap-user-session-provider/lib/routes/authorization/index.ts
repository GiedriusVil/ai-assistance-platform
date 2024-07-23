/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router();

import {
  authorizationController,
} from '../../controllers';

routes.post('/tenant', authorizationController.authorize);
routes.post('/session', authorizationController.authorize);

export {
  routes,
}
