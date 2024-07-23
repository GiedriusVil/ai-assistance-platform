/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

import { routes as aiTranslationServicesRoutes } from './ai-translation-services';
import { routes as aiTranslationServicesChangesRoutes } from './ai-translation-services-changes';
import { routes as aiTranslationModelsRoutes } from './ai-translation-models';
import { routes as aiTranslationModelsChangesRoutes } from './ai-translation-models-changes';
import { routes as aiTranslationModelExamplesRoutes } from './ai-translation-model-examples';
import { routes as aiTranslationPromptsRoutes } from './ai-translation-prompts';

const routes = Router();

routes.use('/services', aiTranslationServicesRoutes);
routes.use('/services/changes', aiTranslationServicesChangesRoutes);
routes.use('/models', aiTranslationModelsRoutes);
routes.use('/models/changes', aiTranslationModelsChangesRoutes);
routes.use('/examples', aiTranslationModelExamplesRoutes);
routes.use('/prompts', aiTranslationPromptsRoutes);

export {
  routes,
};
