/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import { Router } from 'express';

const multer = require('multer');

const importer = multer({
  storage: multer.diskStorage({})
});

const routes = Router();

import {
  filesController,
} from '../../controller';

routes.post('/delete-many-by-ids', filesController.deleteManyByIds);
routes.post('/find-many-by-query', filesController.findManyByQuery);
routes.post('/find-one-by-id', filesController.findOneById);
routes.post('/save-one', importer.single('file'), filesController.saveOne);

export {
  routes,
}
