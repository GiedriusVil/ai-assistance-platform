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

import { routes as accessGroupsExportRoutes } from './access-groups';
import { routes as applicationsExportRoutes } from './applications';
import { routes as tenantsExportRoutes } from './tenants';

const routes = Router();

routes.use(
  '/applications',
  allowIfHasPagesPermissions('ApplicationsViewV1'),
  applicationsExportRoutes,
);
routes.use(
  '/tenants',
  allowIfHasPagesPermissions('TenantsViewV1'),
  tenantsExportRoutes,
);
routes.use(
  '/access-groups',
  allowIfHasPagesPermissions('AccessGroupsViewV1'),
  accessGroupsExportRoutes,
);

export {
  routes,
} 
