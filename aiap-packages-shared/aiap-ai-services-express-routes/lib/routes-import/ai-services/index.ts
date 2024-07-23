/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router({ mergeParams: true });

const multer = require('multer');

const importer = multer({
  storage: multer.diskStorage({})
});

import {
  aiServicesController,
} from '../../controllers';

routes.post('/', importer.single('aiServicesFile'), aiServicesController.importManyFromFile);

export {
  routes,
}
