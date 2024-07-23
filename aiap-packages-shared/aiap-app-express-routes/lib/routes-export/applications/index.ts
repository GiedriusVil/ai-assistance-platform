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

const routes = Router({ mergeParams: true });

routes.get('/', applicationsController.exportMany);

export {
  routes,
}
