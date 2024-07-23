/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

import {
  allowIfHasPagesPermissions,
} from '@ibm-aiap/aiap-user-session-provider';

import * as engagementsRoutes from './engagements';
import * as engagementsChangesRoutes from './engagements-changes';

const routes = Router();

routes.use(
  '/',
  allowIfHasPagesPermissions('EngagementsViewV1'),
  engagementsRoutes.routes
);

routes.use(
  '/changes',
  allowIfHasPagesPermissions('EngagementsChangesViewV1'),
  engagementsChangesRoutes.routes,
);

export {
  routes
};
