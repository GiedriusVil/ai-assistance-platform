/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

import * as engagementsImportRoutes from './engagements';

const routes = Router();

routes.use('/engagements', engagementsImportRoutes.routes);

export {
  routes
};
