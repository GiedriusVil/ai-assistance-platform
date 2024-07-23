/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const validationRoutes = express.Router();

const validationController = require('../controllers');

validationRoutes.post('/validate-one', validationController.validateOne);
validationRoutes.post('/validate-many', validationController.validateMany);

module.exports = {
  validationRoutes,
};
