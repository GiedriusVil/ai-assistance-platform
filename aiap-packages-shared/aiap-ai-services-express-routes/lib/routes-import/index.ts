/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router({ mergeParams: true });

import * as aiServicesRoutes from './ai-services';
import * as aiSkillsRoutes from './ai-skills';

routes.use('/services', aiServicesRoutes.routes);
routes.use('/skills', aiSkillsRoutes.routes);

export {
  routes,
}
