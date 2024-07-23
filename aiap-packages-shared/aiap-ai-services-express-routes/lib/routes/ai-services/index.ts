/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router();

import {
  aiServicesController,
} from '../../controllers';

routes.post('/delete-many-by-ids', aiServicesController.deleteManyByIds);
routes.post('/find-many-by-query', aiServicesController.findManyByQuery);
routes.post('/find-one-by-id', aiServicesController.findOneById);
routes.post('/pull-options', aiServicesController.retrievePullOptions);
routes.post('/save-one', aiServicesController.saveOne);
routes.post('/sync-one-by-id', aiServicesController.syncOneById);

export {
  routes,
}
