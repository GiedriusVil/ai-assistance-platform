/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const { chatAppFullScreen } = require('../controllers');

routes.get('/chat-app-full-screen', chatAppFullScreen);

module.exports = routes;
