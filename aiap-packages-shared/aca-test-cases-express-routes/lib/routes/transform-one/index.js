/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const transformRoutes = express.Router();

const { testCasesController } = require('../../controllers');

transformRoutes.post('/', testCasesController.transformOne);

module.exports = {
  transformRoutes
};
