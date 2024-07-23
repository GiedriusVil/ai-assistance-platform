/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const docValidationMetricsRoutes = express.Router();

const { docValidationsController } = require('../controller');

docValidationMetricsRoutes.post(
  '/total-validation-requests-by-day',
  docValidationsController.totalValidationRequestsByDay
);

docValidationMetricsRoutes.post(
  '/count-rule-frequency',
  docValidationsController.countRuleFrequency
);

module.exports = {
  docValidationMetricsRoutes,
};
