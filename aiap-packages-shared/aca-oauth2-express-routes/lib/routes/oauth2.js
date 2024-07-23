/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const oauth2Routes = express.Router();

const { oauth2Controller } = require('../controller');

oauth2Routes.post('/token', oauth2Controller.token);

module.exports = {
  oauth2Routes,
}
