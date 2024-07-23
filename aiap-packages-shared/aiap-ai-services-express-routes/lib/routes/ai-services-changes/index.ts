/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router();

import {
  aiServicesChangesController,
} from '../../controllers';

routes.post('/find-many-by-query', aiServicesChangesController.findManyByQuery);
routes.post('/find-one-by-id', aiServicesChangesController.findOneById);

export {
  routes,
}
