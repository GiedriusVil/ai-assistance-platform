/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import { Router } from 'express';

import {
  accessGroupsChangesController,
} from '../../controllers';

const routes = Router();

routes.post('/find-many-by-query', accessGroupsChangesController.findManyByQuery);

export {
  routes,
}

