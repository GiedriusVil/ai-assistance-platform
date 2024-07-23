/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router({ mergeParams: true });

import {
  aiSkillReleasesController,
} from '../../controllers';

routes.post('/delete-many-by-ids', aiSkillReleasesController.deleteManyByIds);
routes.post('/deploy-one', aiSkillReleasesController.deployOne);
routes.post('/find-many-by-query', aiSkillReleasesController.findManyByQuery);
routes.post('/find-many-lite-by-query', aiSkillReleasesController.findManyLiteByQuery);
routes.post('/find-one-by-id', aiSkillReleasesController.findOneById);

export {
  routes,
}
