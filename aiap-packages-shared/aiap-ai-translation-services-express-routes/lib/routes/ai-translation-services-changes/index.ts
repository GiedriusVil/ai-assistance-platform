/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router
} from 'express';

import {
  aiTranslationServicesChangesController,
} from '../../controllers';

const routes = Router();

routes.post('/find-many-by-query', aiTranslationServicesChangesController.findManyByQuery);
routes.post('/find-one-by-id', aiTranslationServicesChangesController.findOneById);

export {
  routes,
};
