/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const engineV1Routes = express.Router();
const controller = require('./engine/controllers');

engineV1Routes.post('/create', controller.createEngineInstance);
engineV1Routes.post('/delete', controller.deleteEngineInstance);
engineV1Routes.post('/reset-all', controller.resetAllEngines);
engineV1Routes.post('/reset-one', controller.resetEngineInstanceByContext);

module.exports = {
   engineV1Routes
};
