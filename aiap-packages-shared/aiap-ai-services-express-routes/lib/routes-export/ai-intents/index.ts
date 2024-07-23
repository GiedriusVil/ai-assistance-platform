/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router({ mergeParams: true });

import {
  aiIntentsController,
} from '../../controllers';

routes.get('/', aiIntentsController.exportManyByQuery);

export {
  routes,
}

