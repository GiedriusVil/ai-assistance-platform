/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express'

import {
  accessGroupsController,
} from '../../controllers';

const routes = Router({ mergeParams: true });

routes.get('/', accessGroupsController.exportMany);

export {
  routes,
}
