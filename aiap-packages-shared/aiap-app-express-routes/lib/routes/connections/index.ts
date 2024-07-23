/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router();

import {
  connectionsController,
} from '../../controllers';

routes.post('/mongo/test', connectionsController.testMongoConnection);
routes.post('/redis/test', connectionsController.testRedisConnection);

export {
  routes,
} 
