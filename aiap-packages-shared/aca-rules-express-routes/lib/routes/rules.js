/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { rulesController } = require('../controller');

const rulesRoutes = express.Router();
rulesRoutes.post(
  '/save-one',
  allowIfHasActionsPermissions('rules.view.add', 'rules.view.edit'),
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
  '/delete-one-by-id',
  allowIfHasActionsPermissions('rules.view.delete'),
  rulesController.deleteOneById
);
rulesRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('rules.view.delete'),
  rulesController.deleteManyByIds
);
rulesRoutes.post(
  '/export',
  allowIfHasActionsPermissions('rules.view.export'),
  rulesController.exportRules
);
rulesRoutes.post(
  '/pull',
  allowIfHasActionsPermissions('rules.view.pull'),
  rulesController.pull
);
rulesRoutes.post(
  '/enable-many-by-ids',
  allowIfHasActionsPermissions('rules.view.edit'),
  rulesController.enableManyByIds
);

module.exports = {
  rulesRoutes,
};
