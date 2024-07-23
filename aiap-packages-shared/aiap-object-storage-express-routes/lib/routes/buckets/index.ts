/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router();

import {
  bucketsController,
} from '../../controller';

routes.post('/delete-many-by-ids', bucketsController.deleteManyByIds);
routes.post('/find-many-by-query', bucketsController.findManyByQuery);
routes.post('/find-one-by-id', bucketsController.findOneById);
routes.post('/save-one', bucketsController.saveOne);

export {
  routes,
}
