/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasPagesPermissions,
  allowIfHasAnyActionsPermissions,
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const {
  rulesClassificationsController
} = require('../controller');

const rulesClassificationsRoutes = express.Router();

rulesClassificationsRoutes.post(
  '/find-one-by-id',
  allowIfHasPagesPermissions('ClassificationRulesViewV1'),
  rulesClassificationsController.findOneById
);
rulesClassificationsRoutes.post(
  '/find-many-by-query',
  allowIfHasPagesPermissions('ClassificationRulesViewV1'),
  rulesClassificationsController.findManyByQuery
);
rulesClassificationsRoutes.post(
  '/save-one',
  allowIfHasAnyActionsPermissions('classification-rules.view.edit.classifications.add', 'classification-rules.view.edit.classifications.edit'),
  rulesClassificationsController.saveOne
);
rulesClassificationsRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('classification-rules.view.edit.classifications.remove'),
  rulesClassificationsController.deleteManyByIds
);

module.exports = {
  rulesClassificationsRoutes,
};
