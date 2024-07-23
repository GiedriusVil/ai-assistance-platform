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

const { rulesController } = require('../controller');

const rulesRoutes = express.Router();

rulesRoutes.post(
  '/find-one-by-id',
  allowIfHasPagesPermissions('CatalogRulesView'),
  rulesController.findOneById,
);
rulesRoutes.post(
  '/find-many-by-query',
  allowIfHasPagesPermissions('CatalogRulesView'),
  rulesController.findManyByQuery,
);
rulesRoutes.post(
  '/save-one',
  allowIfHasAnyActionsPermissions('catalog-rules.view.add', 'catalog-rules.view.edit'),
  rulesController.saveOne,
);
rulesRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('catalog-rules.view.remove'),
  rulesController.deleteManyByIds,
);
rulesRoutes.post(
  '/import-many',
  allowIfHasActionsPermissions('catalog-rules.view.import'),
  formidableMiddlewareWrapper(),
  rulesController.importMany
);
rulesRoutes.post(
  '/export-many',
  allowIfHasActionsPermissions('catalog-rules.view.export'),
  rulesController.exportMany
);

module.exports = {
  rulesRoutes,
};
