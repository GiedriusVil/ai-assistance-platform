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
  rulesConditionsController
} = require('../controller');

const rulesConditionsRoutes = express.Router();

rulesConditionsRoutes.post(
  '/find-one-by-id',
  allowIfHasPagesPermissions('ClassificationRulesViewV1'),
  rulesConditionsController.findOneById
);
rulesConditionsRoutes.post(
  '/find-many-by-query',
  allowIfHasPagesPermissions('ClassificationRulesViewV1'),
  rulesConditionsController.findManyByQuery
);
rulesConditionsRoutes.post(
  '/save-one',
  allowIfHasAnyActionsPermissions('classification-rules.view.edit.conditions.add', 'classification-rules.view.edit.conditions.edit'),
  rulesConditionsController.saveOne
);
rulesConditionsRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('classification-rules.view.edit.conditions.remove'),
  rulesConditionsController.deleteManyByIds
);

module.exports = {
  rulesConditionsRoutes,
};
