/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const formidableMiddleware = require('express-formidable');

const {
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const organizationsImportRoutes = express.Router();

const { organizationsImportController } = require('../controller');

organizationsImportRoutes.post(
  '/save-one',
  allowIfHasActionsPermissions('organizations.view.add'),
  organizationsImportController.saveOne
);
organizationsImportRoutes.post(
  '/find-many-by-query',
  organizationsImportController.findManyByQuery
);
organizationsImportRoutes.post(
  '/find-one-by-id',
  organizationsImportController.findOneById
);
organizationsImportRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('organizations.view.delete'),
  organizationsImportController.deleteManyByIds
);
organizationsImportRoutes.post(
  '/upload',
  allowIfHasActionsPermissions('organizations.view.add'),
  formidableMiddleware(),
  organizationsImportController.uploadFile
);
organizationsImportRoutes.post(
  '/submit',
  allowIfHasActionsPermissions('organizations.view.add'),
  organizationsImportController.submitImport
);
organizationsImportRoutes.post(
  '/clear-import',
  allowIfHasActionsPermissions('organizations.view.delete'),
  organizationsImportController.clearImport
);

module.exports = {
  organizationsImportRoutes,
};
