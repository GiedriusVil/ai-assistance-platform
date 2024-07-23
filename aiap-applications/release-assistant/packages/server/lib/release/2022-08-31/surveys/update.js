/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const update = async (db, params) => {
  const CONFIG = params.config;

  const TRANSFORMED_SURVEYS = params.transformedSurveys;
  const OPERATIONS = TRANSFORMED_SURVEYS.map((transformedSurvey) => {
    const OPERATION = {
      replaceOne: {
        filter: {
          _id: transformedSurvey._id,
        },
        replacement: transformedSurvey
      }
    }

    return OPERATION;
  });


  await db.collection(CONFIG.app.collections.surveys).bulkWrite(OPERATIONS, { ordered: false });
};

module.exports = {
  update,
};
