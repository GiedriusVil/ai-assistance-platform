/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasActionsPermissions,
  allowIfHasAnyActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const rulesConditionsRoutes = express.Router({ mergeParams: true });

const { rulesConditionsController } = require('../../controller');

rulesConditionsRoutes.post(
  '/delete-many-by-ids',
  allowIfHasActionsPermissions('rules-v2.view.edit.conditions.remove'),
  rulesConditionsController.deleteManyByIds
);
rulesConditionsRoutes.post(
  '/find-many-by-query',
  rulesConditionsController.findManyByQuery
);
rulesConditionsRoutes.post(
  '/find-one-by-id',
  rulesConditionsController.findOneById
);
rulesConditionsRoutes.post(
  '/save-one',
  allowIfHasAnyActionsPermissions(
    'rules-v2.view.edit.conditions.add',
    'rules-v2.view.edit.conditions.edit'
  ),
  rulesConditionsController.saveOne
);

module.exports = rulesConditionsRoutes;
