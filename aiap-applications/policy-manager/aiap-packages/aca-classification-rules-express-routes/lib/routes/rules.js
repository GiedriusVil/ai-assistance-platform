/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const { formidableMiddlewareWrapper } = require('@ibm-aiap/aiap-express-midleware-provider');

const {
  allowIfHasPagesPermissions,
  allowIfHasAnyActionsPermissions,
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const {
  rulesController
} = require('../controller');

const rulesRoutes = express.Router();

rulesRoutes.post(
  '/find-one-by-id',
  allowIfHasPagesPermissions('ClassificationRulesViewV1'),
  rulesController.findOneById
);
rulesRoutes.post(
  '/find-many-by-query',
  allowIfHasPagesPermissions('ClassificationRulesViewV1'),
  rulesController.findManyByQuery
);
rulesRoutes.post(
  '/save-one',
  allowIfHasAnyActionsPermissions('classification-rules.view.add', 'classification-rules.view.edit'),
  rulesController.saveOne
);
rulesRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('classification-rules.view.remove'),
  rulesController.deleteManyByIds
);
rulesRoutes.post(
  '/import-many',
  allowIfHasActionsPermissions('classification-rules.view.import'),
  formidableMiddlewareWrapper(),
  rulesController.importMany
);
rulesRoutes.post(
  '/export-many',
  allowIfHasActionsPermissions('classification-rules.view.export'),
  rulesController.exportMany
);

module.exports = {
  rulesRoutes,
};
