/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router
} from 'express';

import {
  aiTranslationServicesController,
} from '../../controllers';

const routes = Router();

routes.post('/delete-many-by-ids', aiTranslationServicesController.deleteManyByIds);
routes.post('/find-many-by-query', aiTranslationServicesController.findManyByQuery);
routes.post('/find-one-by-id', aiTranslationServicesController.findOneById);
routes.post('/save-one', aiTranslationServicesController.saveOne);

export {
  routes,
};
