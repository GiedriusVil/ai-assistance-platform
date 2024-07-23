/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

const routes = Router();

import {
  tenantsController,
} from '../../controllers';

routes.get('/', tenantsController.findManyByQuery);
routes.get('/pull-tenants', tenantsController.retrievePullTenants);
routes.get('/api-key', tenantsController.generateApiKey);
routes.get('/new-tenant', tenantsController.getNewTenant);
routes.get('/:id', tenantsController.findOneById);

routes.post('/delete-one-by-id', tenantsController.deleteOneById);
routes.post('/delete-many-by-ids', tenantsController.deleteManyByIds);
routes.post('/delete-many-by-ids', tenantsController.deleteManyByIds);
routes.post('/save-one', tenantsController.saveOne);
routes.post('/find-many-lite-by-query', tenantsController.findManyLiteByQuery);

export {
  routes,
}
