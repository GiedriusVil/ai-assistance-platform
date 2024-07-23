/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const formidableMiddleware = require('express-formidable');

const {
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const rulesMessagesImportRoutes = express.Router();

const { rulesMessagesImportController } = require('../controller');

rulesMessagesImportRoutes.post(
  '/save-one',
  allowIfHasActionsPermissions('messages.view.add'),
  rulesMessagesImportController.saveOne
);
rulesMessagesImportRoutes.post(
  '/find-many-by-query',
  rulesMessagesImportController.findManyByQuery
);
rulesMessagesImportRoutes.post(
  '/find-one-by-id',
  rulesMessagesImportController.findOneById
);
rulesMessagesImportRoutes.post(
  '/delete-one-by-id',
  allowIfHasActionsPermissions('messages.view.delete'),
  rulesMessagesImportController.deleteOneById
);
rulesMessagesImportRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('messages.view.delete'),
  rulesMessagesImportController.deleteManyByIds
);
rulesMessagesImportRoutes.post(
  '/upload',
  allowIfHasActionsPermissions('messages.view.add'),
  formidableMiddleware(),
  rulesMessagesImportController.uploadFile
);
rulesMessagesImportRoutes.post(
  '/submit',
  allowIfHasActionsPermissions('messages.view.add'),
  rulesMessagesImportController.submitImport
);
rulesMessagesImportRoutes.post(
  '/clear-import',
  allowIfHasActionsPermissions('messages.view.delete'),
  rulesMessagesImportController.clearImport
);

module.exports = {
  rulesMessagesImportRoutes,
};
