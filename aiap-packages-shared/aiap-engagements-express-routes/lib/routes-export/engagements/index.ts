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

const routes = Router({ mergeParams: true });

routes.get('/', engagementsController.exportMany);

export {
   routes
};
