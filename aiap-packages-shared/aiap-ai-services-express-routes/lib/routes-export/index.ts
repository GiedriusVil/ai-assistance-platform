/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router({ mergeParams: true });

import * as aiServices from './ai-services';
import * as aiIntents from './ai-intents';
import * as aiEntities from './ai-entities';
import * as aiDialogNodes from './ai-dialog-nodes';

routes.use('/services', aiServices.routes);
routes.use('/intents', aiIntents.routes);
routes.use('/entities', aiEntities.routes);
routes.use('/dialog-nodes', aiDialogNodes.routes);

export {
  routes,
}
