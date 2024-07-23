/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const organizationsRoutes = express.Router();

const {
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { organizationsController } = require('../controller');

organizationsRoutes.post(
  '/save-one',
  allowIfHasActionsPermissions('organizations.view.add'),
  organizationsController.saveOne
);
organizationsRoutes.post(
  '/find-one-by-id',
  organizationsController.findOneById
);
organizationsRoutes.post(
  '/find-many-by-query',
  organizationsController.findManyByQuery
);
organizationsRoutes.post(
  '/find-many-lite-by-query',
  organizationsController.findManyLiteByQuery
);
organizationsRoutes.post(
  '/delete-one-by-id',
  allowIfHasActionsPermissions('organizations.view.delete'),
  organizationsController.deleteOneById
);
organizationsRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('organizations.view.delete'),
  organizationsController.deleteManyByIds
);
organizationsRoutes.post(
  '/pull',
  allowIfHasActionsPermissions('organizations.view.pull'),
  organizationsController.pull
);

organizationsRoutes.post(
  '/export',
  allowIfHasActionsPermissions('organizations.view.export'),
  organizationsController.exportOrganizations
);

module.exports = {
  organizationsRoutes,
};
