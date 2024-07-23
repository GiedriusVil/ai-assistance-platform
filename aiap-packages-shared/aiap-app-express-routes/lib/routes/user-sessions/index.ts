/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

import {
  userSessionsController,
} from '../../controllers';

const routes = Router();

routes.post('/terminate', userSessionsController.terminate);

export {
  routes,
}
