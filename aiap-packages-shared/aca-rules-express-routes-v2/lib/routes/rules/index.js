/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasActionsPermissions,
  allowIfHasAnyActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const rulesRoutes = express.Router({ mergeParams: true });

const { rulesController } = require('../../controller');

rulesRoutes.post(
  '/save-one',
  allowIfHasAnyActionsPermissions(
    'rules-v2.view.add',
    'rules-v2.view.edit'
  ),
  rulesController.saveOne
);
rulesRoutes.post(
  '/find-many-by-query',
  rulesController.findManyByQuery
);
rulesRoutes.post(
  '/find-one-by-id',
  rulesController.findOneById
);
rulesRoutes.post(
  '/delete-many-by-keys',
  allowIfHasActionsPermissions('rules-v2.view.remove'),
  rulesController.deleteManyByKeys
);
rulesRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('rules-v2.view.remove'),
  rulesController.deleteManyByIds
);

module.exports = rulesRoutes;
