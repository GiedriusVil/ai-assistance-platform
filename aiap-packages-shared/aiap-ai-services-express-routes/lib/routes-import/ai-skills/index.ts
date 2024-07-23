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
  aiSkillsController,
} from '../../controllers';

routes.post('/sync-many-by-files', importer.array('file[]'), aiSkillsController.syncManyByFiles);

export {
  routes,
}
