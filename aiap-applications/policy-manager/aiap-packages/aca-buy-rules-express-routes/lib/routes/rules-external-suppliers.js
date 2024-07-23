/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const {
  allowIfHasPagesPermissions
} = require('@ibm-aiap/aiap-user-session-provider');

const { rulesExternalSuppliersController } = require('../controller');

const rulesExternalSuppliersRoutes = express.Router();

rulesExternalSuppliersRoutes.post(
  '/find-many-by-query',
  allowIfHasPagesPermissions('BuyRulesView'),
  rulesExternalSuppliersController.findManyByQuery,
);

module.exports = {
  rulesExternalSuppliersRoutes,
};
