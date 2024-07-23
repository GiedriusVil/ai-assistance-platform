/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router
} from 'express';

import {
  aiTranslationPromptsController,
} from '../../controllers';

const routes = Router();

routes.post('/delete-many-by-ids', aiTranslationPromptsController.deleteManyByIds);
routes.post('/delete-many-by-prompts-ids', aiTranslationPromptsController.deleteManyByPromptsIds);
routes.post('/find-many-by-query', aiTranslationPromptsController.findManyByQuery);
routes.post('/find-one-by-id', aiTranslationPromptsController.findOneById);
routes.post('/find-one-by-query', aiTranslationPromptsController.findOneByQuery);
routes.post('/save-one', aiTranslationPromptsController.saveOne);
routes.post('/find-supported-languages', aiTranslationPromptsController.findSupportedLanguages);
routes.post('/test-one-by-prompt-id', aiTranslationPromptsController.testByPromptId);

export {
  routes,
};
