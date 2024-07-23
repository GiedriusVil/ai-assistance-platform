/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

import {
  aiTranslationModelsController,
} from '../../controllers';

const routes = Router({ mergeParams: true });

const multer = require('multer');

const importer = multer({
  storage: multer.diskStorage({})
});

routes.post('/', importer.single('aiTranslationModelsFile'), aiTranslationModelsController.importManyFromFile);

export {
  routes,
} 
