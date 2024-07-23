/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { allowIfHasActionsPermissions } = require('@ibm-aiap/aiap-user-session-provider');
const express = require('express');

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
  allowIfHasActionsPermissions('buy-rule-audits.view.export'),
  rulesAuditsController.exportMany,
);

module.exports = {
  rulesAuditsRoutes,
};
