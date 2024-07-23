/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const docValidationV2Routes = express.Router();

const { docValidationV2Controller } = require('../../controllers');

docValidationV2Routes.post(
  '/validate-one',
  docValidationV2Controller.validateOne
);
docValidationV2Routes.post(
  '/validate-many',
  docValidationV2Controller.validateMany
);

module.exports = {
  docValidationV2Routes,
};
