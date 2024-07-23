/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { ruleActionsAuditsController } = require('../controllers');

const ruleActionsAuditsRoutes = express.Router({ mergeParams: true });

ruleActionsAuditsRoutes.post(
  '/find-many-by-query',
  ruleActionsAuditsController.findManyByQuery
);
ruleActionsAuditsRoutes.post(
  '/find-one-by-id',
  ruleActionsAuditsController.findOneById
);
ruleActionsAuditsRoutes.post(
  '/export-many',
  allowIfHasActionsPermissions('rule-action-audits.view.export'),
  ruleActionsAuditsController.exportMany,
);

module.exports = {
  ruleActionsAuditsRoutes,
};
