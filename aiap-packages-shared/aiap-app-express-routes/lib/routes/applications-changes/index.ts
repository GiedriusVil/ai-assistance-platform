/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router();

import {
  applicationsChangesController,
} from '../../controllers';

routes.post('/find-many-by-query', applicationsChangesController.findManyByQuery);

export {
  routes,
}
