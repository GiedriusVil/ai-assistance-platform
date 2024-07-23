/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

import * as engagementsExportRoutes from './engagements';

const routes = Router({ mergeParams: true });

routes.use('/engagements', engagementsExportRoutes.routes);

export {
  routes
};
