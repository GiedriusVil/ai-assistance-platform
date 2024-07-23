/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

import multer from 'multer';

import {
  aiTranslationPromptsController,
} from '../../controllers';

const routes = Router({ mergeParams: true });

const importer = multer({
  storage: multer.diskStorage({})
});

routes.post('/', importer.single('aiTranslationModelsFile'), aiTranslationPromptsController.importManyFromFile);

export {
  routes,
} 
