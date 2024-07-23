/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

import {
  allowIfHasPagesPermissions,
} from '@ibm-aiap/aiap-user-session-provider';

import { routes as accessGroupsImportRoutes } from './access-groups';
import { routes as applicationsImportRoutes } from './applications';
import { routes as tenantsImportRoutes } from './tenants';

const routes = Router();

routes.use(
  '/applications',
  allowIfHasPagesPermissions('ApplicationsViewV1'),
  applicationsImportRoutes
);
routes.use(
  '/access-groups',
  allowIfHasPagesPermissions('AccessGroupsViewV1'),
  accessGroupsImportRoutes
);
routes.use(
  '/tenants',
  allowIfHasPagesPermissions('TenantsViewV1'),
  tenantsImportRoutes
);

export {
  routes,
} 
