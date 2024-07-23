/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');

const SERVER_ROUTES_REGISTRY = express.Router();

SERVER_ROUTES_REGISTRY.use(express());

module.exports = {
    SERVER_ROUTES_REGISTRY,
};
