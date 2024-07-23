/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const mongoClientsRoutes = express.Router();

const { mongoClientsController } = require('../../controllers');

mongoClientsRoutes.get('/', mongoClientsController.retrieveMany);

module.exports = {
    mongoClientsRoutes
};
