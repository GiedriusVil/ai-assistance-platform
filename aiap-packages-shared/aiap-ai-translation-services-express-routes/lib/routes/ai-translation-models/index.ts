/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router
} from 'express';

import {
  aiTranslationModelsController,
} from '../../controllers';

const routes = Router();

routes.post('/delete-many-by-ids', aiTranslationModelsController.deleteManyByIds);
routes.post('/delete-many-by-service-model-ids', aiTranslationModelsController.deleteManyByServiceModelIds);
routes.post('/find-many-by-query', aiTranslationModelsController.findManyByQuery);
routes.post('/find-one-by-query', aiTranslationModelsController.findOneByQuery);
routes.post('/save-one', aiTranslationModelsController.saveOne);
routes.post('/find-supported-languages', aiTranslationModelsController.findSupportedLanguages);
routes.post('/train-one-by-service-model-id', aiTranslationModelsController.trainOneByServiceModelId);
routes.post('/test-one-by-service-model-id', aiTranslationModelsController.testByServiceModelId);
routes.post('/identify-language-by-id', aiTranslationModelsController.identifyLanguageById);

export {
  routes,
};
