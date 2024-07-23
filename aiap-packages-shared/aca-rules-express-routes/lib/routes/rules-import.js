/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const formidableMiddleware = require('express-formidable');

const {
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { rulesImportController } = require('../controller');

const rulesImportRoutes = express.Router();
rulesImportRoutes.post(
  '/save-one',
  allowIfHasActionsPermissions('rules.view.add'),
  rulesImportController.saveOne
);
rulesImportRoutes.post(
  '/find-many-by-query',
  rulesImportController.findManyByQuery
);
rulesImportRoutes.post(
  '/find-one-by-id',
  rulesImportController.findOneById
);
rulesImportRoutes.post(
  '/delete-one-by-id',
  allowIfHasActionsPermissions('rules.view.delete'),
  rulesImportController.deleteOneById
);
rulesImportRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('rules.view.delete'),
  rulesImportController.deleteManyByIds
);
rulesImportRoutes.post(
  '/upload',
  allowIfHasActionsPermissions('rules.view.add'),
  formidableMiddleware(),
  rulesImportController.importRulesFromFile
);
rulesImportRoutes.post(
  '/submit',
  allowIfHasActionsPermissions('rules.view.add'),
  rulesImportController.submitImport
);
rulesImportRoutes.post(
  '/clear-import',
  allowIfHasActionsPermissions('rules.view.delete'),
  rulesImportController.clearImport
);
rulesImportRoutes.post(
  '/enable-many-by-ids',
  allowIfHasActionsPermissions('rules.view.edit'),
  rulesImportController.enableManyByIds
);

module.exports = {
  rulesImportRoutes,
};
