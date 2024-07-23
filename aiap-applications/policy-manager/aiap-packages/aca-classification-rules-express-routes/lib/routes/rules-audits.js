/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasActionsPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const { rulesAuditsController } = require('../controller');

const rulesAuditsRoutes = express.Router({ mergeParams: true });

rulesAuditsRoutes.post(
  '/find-many-by-query',
  rulesAuditsController.findManyByQuery
);
rulesAuditsRoutes.post(
  '/find-one-by-id',
  rulesAuditsController.findOneById
);
rulesAuditsRoutes.post(
  '/export-many',
  allowIfHasActionsPermissions('classification-rule-audits.view.export'),
  rulesAuditsController.exportMany,
);

module.exports = {
  rulesAuditsRoutes,
};
