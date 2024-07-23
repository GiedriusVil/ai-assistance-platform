/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router
} from 'express';

import {
  aiTranslationModelsChangesController,
} from '../../controllers';

const routes = Router();

routes.post('/find-many-by-query', aiTranslationModelsChangesController.findManyByQuery);
routes.post('/find-one-by-id', aiTranslationModelsChangesController.findOneById);

export {
  routes,
};
