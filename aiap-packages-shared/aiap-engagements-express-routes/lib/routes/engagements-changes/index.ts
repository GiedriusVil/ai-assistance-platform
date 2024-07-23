/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
   Router,
} from 'express';

import {
   engagementsChangesController
} from '../../controller';

const routes = Router();

routes.post('/find-many-by-query', engagementsChangesController.findManyByQuery);
routes.post('/find-one-by-id', engagementsChangesController.findOneById);

export {
   routes
}
