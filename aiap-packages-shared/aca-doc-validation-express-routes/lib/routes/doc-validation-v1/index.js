/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const docValidationV1Routes = express.Router();

const { docValidationV1Controller } = require('../../controllers');

docValidationV1Routes.post(
  '/validate-one',
  docValidationV1Controller.validateOne
);
docValidationV1Routes.post(
  '/validate-many',
  docValidationV1Controller.validateMany
);

module.exports = {
  docValidationV1Routes,
};
