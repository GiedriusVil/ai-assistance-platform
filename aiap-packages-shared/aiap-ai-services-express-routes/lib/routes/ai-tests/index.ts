/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router();

import {
  aiServiceTestsController,
} from '../../controllers';

routes.get('/', aiServiceTestsController.findManyByQuery);
routes.post('/find-many-lite-by-query', aiServiceTestsController.findManyLiteByQuery);
routes.post('/', aiServiceTestsController.executeOne); // We need to change path - as there might be need to update some details about test - for example adding a comment!
routes.get('/report/:id', aiServiceTestsController.findClassificationReportsByQuery);
routes.get('/intents/:id', aiServiceTestsController.findIncorrectIntentsById);
routes.get('/results/:id', aiServiceTestsController.findTestResultsById);
routes.get('/:id', aiServiceTestsController.findOneById);
routes.delete('/:id', aiServiceTestsController.deleteOneById);

export {
  routes,
}
