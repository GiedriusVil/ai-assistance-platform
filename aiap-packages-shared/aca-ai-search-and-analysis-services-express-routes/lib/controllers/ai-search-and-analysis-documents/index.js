/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/

const { deleteManyByServiceProjectCollectionsAndDocuments } = require('./delete-many-by-service-project-collections-id-and-documents');
const { listManyByQuery } = require('./list-many-by-query');

module.exports = {
  deleteManyByServiceProjectCollectionsAndDocuments,
  listManyByQuery,
};
