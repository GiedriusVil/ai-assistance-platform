/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { findManyClassesByQuery } = require('./find-many-classes-by-query');
const { findManyCommoditiesByQuery } = require('./find-many-commodities-by-query');
const { findManyFamiliesByQuery } = require('./find-many-families-by-query');
const { findManySegmentsByQuery } = require('./find-many-segments-by-query');

module.exports = { 
    findManyClassesByQuery,
    findManyCommoditiesByQuery,
    findManyFamiliesByQuery,
    findManySegmentsByQuery,
};
