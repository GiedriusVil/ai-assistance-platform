/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
   Router,
} from 'express';

import multer from 'multer';

import {
   engagementsController
} from '../../controller';

const routes = Router({ mergeParams: true });

const importer = multer({
   storage: multer.diskStorage({})
});

routes.post('/', importer.single('engagementsFile'), engagementsController.importManyFromFile);

export {
   routes
}
