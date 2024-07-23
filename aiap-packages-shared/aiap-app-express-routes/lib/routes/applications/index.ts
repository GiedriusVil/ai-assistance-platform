/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

import {
  applicationsController,
} from '../../controllers';

const routes = Router();

routes.post('/find-many-by-query', applicationsController.findManyByQuery);
routes.post('/save-one', applicationsController.saveOne);
routes.post('/find-one-by-id', applicationsController.findOneById);
routes.post('/delete-many-by-ids', applicationsController.deleteManyByIds);

export {
  routes,
}
