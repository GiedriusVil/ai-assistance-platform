/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import { Router } from 'express';

import {
  accessGroupsController,
} from '../../controllers';

const routes = Router();

routes.get('/', accessGroupsController.findManyByQuery);
routes.get('/:id', accessGroupsController.findOneById);

routes.post('/delete-many-by-ids', accessGroupsController.deleteManyByIds);
routes.post('/delete-one-by-id', accessGroupsController.deleteOneById);
routes.post('/', accessGroupsController.saveOne);

export {
  routes,
}





