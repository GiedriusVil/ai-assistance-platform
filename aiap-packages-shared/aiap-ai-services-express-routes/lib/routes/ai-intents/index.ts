/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router({ mergeParams: true });

import {
  aiIntentsController,
} from '../../controllers';

routes.get('/', aiIntentsController.retrieveIntents);
routes.post('/:id/example', aiIntentsController.createExample);
routes.get('/:id/examples', aiIntentsController.retrieveExamples);

export {
  routes,
}












