/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const fulFillWareActionsRoutes = express.Router();

const { fulFillWareActionsController } = require('../../controllers');

fulFillWareActionsRoutes.get('/', fulFillWareActionsController.retrieveMany);

module.exports = {
    fulFillWareActionsRoutes,
};
