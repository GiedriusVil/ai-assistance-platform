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

import {
  allowIfHasConfigurationPermission,
} from '@ibm-aiap/aiap-express-midleware-provider';

import { routes as applicationsRoutes } from './applications';
import { routes as applicationsChangesRoutes } from './applications-changes';
import { routes as tenantsRoutes } from './tenants';
import { routes as tenantsChangesRoutes } from './tenants-changes';
import { routes as userSessionsRoutes } from './user-sessions';
import { routes as usersRoutes } from './users';
import { routes as usersChangesRoutes } from './users-changes';
import { routes as accessGroupsRoutes } from './access-groups';
import { routes as accessGroupsChangesRoutes } from './access-groups-changes';

// [LEGO] This is wrong place -> maybe aca-surgeon-* would be good place ? 
import { routes as connectionsRoutes } from './connections';

const routes = Router();

routes.use(
  '/applications',
  allowIfHasPagesPermissions('ApplicationsViewV1'),
  applicationsRoutes
);
routes.use(
  '/applications/changes',
  allowIfHasPagesPermissions('ApplicationsChangesViewV1'),
  allowIfHasConfigurationPermission('app.changeLogs.applicationsChangesEnabled'),
  applicationsChangesRoutes
);
routes.use(
  '/connections',
  allowIfHasPagesPermissions('TenantsViewV1'),
  connectionsRoutes
);
routes.use(
  '/tenants',
  tenantsRoutes
);
routes.use(
  '/tenants/changes',
  allowIfHasPagesPermissions('TenantsChangesViewV1'),
  allowIfHasConfigurationPermission('app.changeLogs.tenantsChangesEnabled'),
  tenantsChangesRoutes
);
routes.use(
  '/access-groups',
  allowIfHasPagesPermissions('AccessGroupsViewV1'),
  accessGroupsRoutes
);
routes.use(
  '/access-groups/changes',
  allowIfHasPagesPermissions('AccessGroupsChangesViewV1'),
  allowIfHasConfigurationPermission('app.changeLogs.accessGroupsChangesEnabled'),
  accessGroupsChangesRoutes
);
routes.use(
  '/users',
  usersRoutes
);
routes.use(
  '/users/changes',
  allowIfHasPagesPermissions('UsersChangesViewV1'),
  allowIfHasConfigurationPermission('app.changeLogs.usersChangesEnabled'),
  usersChangesRoutes
);
routes.use(
  '/session',
  userSessionsRoutes
);

export {
  routes,
}
