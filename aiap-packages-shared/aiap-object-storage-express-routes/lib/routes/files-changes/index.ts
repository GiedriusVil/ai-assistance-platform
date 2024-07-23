/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import { Router } from 'express';

const routes = Router();

import {
  filesChangesController,
} from '../../controller';

routes.post('/delete-many-by-ids', filesChangesController.deleteManyByIds);
routes.post('/find-many-by-query', filesChangesController.findManyByQuery);
routes.post('/find-one-by-id', filesChangesController.findOneById);
routes.post('/save-one', filesChangesController.saveOne);

export {
  routes,
}
