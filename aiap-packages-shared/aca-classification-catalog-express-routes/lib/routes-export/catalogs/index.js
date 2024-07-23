/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router({mergeParams: true});

const { catalogsController } = require('../../controllers');

routes.get('/', catalogsController.exportMany);

module.exports = routes;
