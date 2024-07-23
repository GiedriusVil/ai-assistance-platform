/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router();

import {
  aiServicesChangeRequestController,
} from '../../controllers';

routes.post('/save-one', aiServicesChangeRequestController.saveOne);
routes.post('/execute-one', aiServicesChangeRequestController.executeOne);
routes.post('/delete-many-by-ids', aiServicesChangeRequestController.deleteManyByIds);
routes.post('/find-many-by-query', aiServicesChangeRequestController.findManyByQuery);
routes.post('/find-one-by-id', aiServicesChangeRequestController.findOneById);
routes.post('/load-form-data', aiServicesChangeRequestController.loadFormData);

export {
  routes,
}
