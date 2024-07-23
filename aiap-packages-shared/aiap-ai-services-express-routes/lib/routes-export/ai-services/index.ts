/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router({ mergeParams: true });

import {
  aiServicesController,
} from '../../controllers';

routes.get('/', aiServicesController.exportManyByQuery);

export {
  routes,
}
