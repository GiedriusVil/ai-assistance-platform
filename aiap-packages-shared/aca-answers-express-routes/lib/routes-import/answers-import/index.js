/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router({mergeParams: true});
const multer = require('multer');
const importer = multer({
   storage: multer.diskStorage({})
})

const { answersController } = require('../../controllers');


routes.post('/', importer.single('answersFile'), answersController.importManyFromFile);

module.exports = routes;
