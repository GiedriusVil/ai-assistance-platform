/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import { Router } from 'express';

const routes = Router();

import {
  bucketsChangesController,
} from '../../controller';

routes.post('/delete-many-by-ids', bucketsChangesController.deleteManyByIds);
routes.post('/find-many-by-query', bucketsChangesController.findManyByQuery);
routes.post('/find-one-by-id', bucketsChangesController.findOneById);
routes.post('/save-one', bucketsChangesController.saveOne);

export {
  routes,
}
