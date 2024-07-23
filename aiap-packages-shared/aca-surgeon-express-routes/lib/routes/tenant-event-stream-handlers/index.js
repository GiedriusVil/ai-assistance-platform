/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const tenantEventStreamHandlersRoutes = express.Router({ mergeParams: true });

const { tenantEventStreamHandlersController } = require('../../controllers');

tenantEventStreamHandlersRoutes.get('/', tenantEventStreamHandlersController.retrieveMany);

module.exports = {
    tenantEventStreamHandlersRoutes,
};
