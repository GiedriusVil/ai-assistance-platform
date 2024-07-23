/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { compilerController } = require('../../controller');

routes.post('/', compilerController.compile);

module.exports = routes;
