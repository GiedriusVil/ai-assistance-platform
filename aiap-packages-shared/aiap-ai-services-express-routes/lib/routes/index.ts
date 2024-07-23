/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router();

import * as aiServicesRoutes from './ai-services';
import * as aiSkillsRoutes from './ai-skills';
import * as aiSkillReleasesRoutes from './ai-skill-releases';
import * as aiIntentsRoutes from './ai-intents';
import * as aiEntitiesRoutes from './ai-entities';
import * as aiTestsRoutes from './ai-tests';
import * as aiServicesChangesRoutes from './ai-services-changes';
import * as aiServicesChangeRequest from './ai-services-change-request';

routes.use('/services', aiServicesRoutes.routes);
routes.use('/services/changes', aiServicesChangesRoutes.routes);
routes.use('/services/change-request', aiServicesChangeRequest.routes);
routes.use('/skills', aiSkillsRoutes.routes);
routes.use('/skills-releases', aiSkillReleasesRoutes.routes);
routes.use('/tests', aiTestsRoutes.routes);
routes.use('/intents', aiIntentsRoutes.routes);
routes.use('/entities', aiEntitiesRoutes.routes);

export {
  routes,
}
