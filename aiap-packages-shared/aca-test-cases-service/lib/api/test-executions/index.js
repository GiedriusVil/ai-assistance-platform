/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { saveOne } = require('./save-one');
const { saveMany } = require('./save-many');

const { generateMany } = require('./generate-many');

const { findManyByQuery } = require('./find-many-by-query');
const { findOneById } = require('./find-one-by-id');
const { deleteManyByIds } = require('./delete-many-by-ids');

module.exports = {
    saveOne,
    saveMany,

    generateMany,

    findManyByQuery,
    findOneById,
    deleteManyByIds,
};
