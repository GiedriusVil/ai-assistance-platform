/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasPagesPermissions,
} = require('@ibm-aiap/aiap-user-session-provider');

const {
  rulesClassificationsExternalController
} = require('../controller');

const rulesClassificationsExternalRoutes = express.Router();

rulesClassificationsExternalRoutes.post(
  '/segments/find-many-by-query',
  allowIfHasPagesPermissions('ClassificationRulesViewV1'),
  rulesClassificationsExternalController.findManySegmentsByQuery
);
rulesClassificationsExternalRoutes.post(
  '/families/find-many-by-query',
  allowIfHasPagesPermissions('ClassificationRulesViewV1'),
  rulesClassificationsExternalController.findManyFamiliesByQuery
);
rulesClassificationsExternalRoutes.post(
  '/classes/find-many-by-query',
  allowIfHasPagesPermissions('ClassificationRulesViewV1'),
  rulesClassificationsExternalController.findManyClassesByQuery
);
rulesClassificationsExternalRoutes.post(
  '/commodities/find-many-by-query',
  allowIfHasPagesPermissions('ClassificationRulesViewV1'),
  rulesClassificationsExternalController.findManyCommoditiesByQuery
);


module.exports = {
  rulesClassificationsExternalRoutes,
};
