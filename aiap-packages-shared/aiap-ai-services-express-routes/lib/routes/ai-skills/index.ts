/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router({ mergeParams: true });

import {
  aiSkillsController,
} from '../../controllers';

routes.post('/find-many-by-query', aiSkillsController.findManyByQuery);
routes.post('/find-many-lite-by-query', aiSkillsController.findManyLiteByQuery);
routes.post('/find-one-by-id', aiSkillsController.findOneById);

routes.post('/delete-many-by-ids', aiSkillsController.deleteManyByIds);

routes.post('/sync-many-by-ids', aiSkillsController.syncManyByIds);
routes.post('/sync-one-by-id', aiSkillsController.syncOneById);

routes.post('/assign-version', aiSkillsController.assignVersion);

routes.post('/pull-one-by-id', aiSkillsController.pullOneById);
routes.post('/pull-many-by-ids', aiSkillsController.pullManyByIds);

export {
  routes,
}
