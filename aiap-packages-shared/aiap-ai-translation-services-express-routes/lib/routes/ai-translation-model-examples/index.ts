/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router
} from 'express';

import {
  aiTranslationModelExamplesController,
} from '../../controllers';

const routes = Router();

routes.post('/delete-many-by-ids', aiTranslationModelExamplesController.deleteManyByIds);
routes.post('/find-many-by-query', aiTranslationModelExamplesController.findManyByQuery);
routes.post('/find-one-by-id', aiTranslationModelExamplesController.findOneById);
routes.post('/save-one', aiTranslationModelExamplesController.saveOne);
routes.post('/save-many', aiTranslationModelExamplesController.saveMany);

export {
  routes
};
