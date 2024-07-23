/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const datasourcesRoutes = express.Router();

const { datasourcesController } = require('../../controllers');

datasourcesRoutes.get('/', datasourcesController.retrieveMany);

module.exports = {
    datasourcesRoutes,
};
