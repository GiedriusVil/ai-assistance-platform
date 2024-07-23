/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const express = require('express');
const routes = express.Router();

const catalogRoutes = require('./catalogs');
const segmentRoutes = require('./segments');
const familyRoutes = require('./families');
const classRoutes = require('./classes');
const subClassRoutes = require('./sub-classes');
const vectorsRoutes = require('./vectors');

routes.use('/catalogs', catalogRoutes);
routes.use('/segments', segmentRoutes);
routes.use('/families', familyRoutes);
routes.use('/classes', classRoutes);
routes.use('/sub-classes', subClassRoutes);
routes.use('/vectors', vectorsRoutes);

module.exports = routes;
