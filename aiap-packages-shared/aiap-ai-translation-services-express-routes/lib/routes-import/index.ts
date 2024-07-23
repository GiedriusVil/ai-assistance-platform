/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

import { routes as aiTranslationServicesRoutes } from './ai-translation-services';
import { routes as aiTranslationModelsRoutes } from './ai-translation-models';
import { routes as aiTranslationPromptsRoutes } from './ai-translation-prompts';
import { routes as aiTranslationModelExamplesRoutes } from './ai-translation-model-examples';

const routes = Router();

routes.use('/services', aiTranslationServicesRoutes);
routes.use('/models', aiTranslationModelsRoutes);
routes.use('/prompts', aiTranslationPromptsRoutes);
routes.use('/examples', aiTranslationModelExamplesRoutes);

export {
  routes,
};
