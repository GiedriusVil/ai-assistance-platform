/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
   Router,
} from 'express';

import {
   engagementsController
} from '../../controller';

const routes = Router();

routes.post('/save-one', engagementsController.saveOne);
routes.post('/find-many-by-query', engagementsController.findManyByQuery);
routes.post('/find-one-by-id', engagementsController.findOneById);
routes.post('/delete-many-by-ids', engagementsController.deleteManyByIds);

export {
   routes
}
