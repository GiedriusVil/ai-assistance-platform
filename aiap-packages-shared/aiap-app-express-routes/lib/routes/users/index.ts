/*
 © Copyright IBM Corporation 2022. All Rights Reserved 
  
 SPDX-License-Identifier: EPL-2.0
*/
import {
  Router,
} from 'express';

import {
  allowIfHasPagesPermissions,
  allowIfHasActionsPermissions,
} from '@ibm-aiap/aiap-user-session-provider';

import {
  usersController,
} from '../../controllers';

const routes = Router();

routes.get('/', allowIfHasPagesPermissions('UsersViewV1'), usersController.findManyByQuery);
routes.get('/:id', allowIfHasPagesPermissions('UsersViewV1'), usersController.findOneById);

routes.post('/', allowIfHasPagesPermissions('UsersViewV1'), usersController.createOne);
routes.post('/delete-one-by-id', allowIfHasPagesPermissions('UsersViewV1'), usersController.deleteOneById);
routes.post('/delete-many-by-ids', allowIfHasPagesPermissions('UsersViewV1'), usersController.deleteManyByIds);

routes.put('/:id', allowIfHasPagesPermissions('UsersViewV1'), usersController.updateOne);
routes.put('/personal-profile/:id', allowIfHasPagesPermissions('PersonalProfileViewV1'), usersController.updateOne);

routes.post('/find-many-by-access-group-names-lite', allowIfHasActionsPermissions('users.get-by-access-group-name.lite'), usersController.findManyLiteByQuery);

routes.post('/export-users-permissions', allowIfHasPagesPermissions('UsersView', 'AccessGroupsView', 'TenantsView'), usersController.exportUsersPermissions);

export {
  routes,
}
