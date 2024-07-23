/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
// Old format
// {
//   "_id": "4e2f56ae-46f1-4f24-9a27-bac8281e0c21",
//   "assistant": "buy-at-ibm-assistant",
//   "comment": "",
//   "conversationId": "60cd5baf-66c9-452c-9754-a83ce2701729",
//   "conversationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZpcnN0TmFtZSI6IkxhdXJlbnQiLCJsYXN0TmFtZSI6IkJvdWRvbiIsImVtYWlsIjoiQk9VRE9OTEBmci5pYm0uY29tIiwiY291bnRyeSI6eyJpc29Db2RlIjoiZW5nIn19LCJjb252ZXJzYXRpb24iOnsiaWQiOiI2MGNkNWJhZi02NmM5LTQ1MmMtOTc1NC1hODNjZTI3MDE3MjkifSwiY2hhbm5lbCI6eyJpZCI6ImRlZmF1bHQifSwiaWF0IjoxNjM4ODcxNjU2fQ.Cb9bsLn7NLCkeUC8O0RsAUFM-2x1YCWAYfXtf2WAF4w",
//   "conversation_score": "Dissatisfied",
//   "created": "2021-12-07T10:09:45.350Z",
//   "tenant": "buy-at-ibm"
// }

// New format
// {
//   "_id": "6aabfcf2-a78d-4a2a-8874-b98d6f82dd44",
//   "assistantId": "buy-at-ibm-assistant",
//   "comment": "Test feedback",
//   "conversationId": "e4b794fc-cbc5-4df9-8f6e-438329c2b68d",
//   "conversationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnQiOnsiaWQiOiJidXktYXQtaWJtLXByb2QtdGVuYW50IiwiaGFzaCI6IjQyZDViMzUzODJjZGQzZGE5Njk4YzhjZmNlOTBiMGNmMDY3YmM4MGEifSwiY29udmVyc2F0aW9uIjp7ImlkIjoiZTRiNzk0ZmMtY2JjNS00ZGY5LThmNmUtNDM4MzI5YzJiNjhkIn0sInVzZXIiOnsiaWQiOiJaWjAwTFU2NDQiLCJmaXJzdE5hbWUiOiJCaWx5YW5hIiwibGFzdE5hbWUiOiJQZXRldmEiLCJlbWFpbCI6IkJpbHlhbmEuUGV0ZXZhQGlibS5jb20iLCJjb3VudHJ5Ijp7ImlzbyI6ImVuZyJ9fSwiY2hhbm5lbCI6eyJpZCI6ImRlZmF1bHQifSwiaWF0IjoxNjUxMTMzODM5fQ.hKjIKKiD_Yvh8YStvNrI9vMULOnsabmu6az_PAbRSfg",
//   "created": "2022-04-28T08:20:42.438Z",
//   "score": "Very Satisfied",
//   "tenantId": "buy-at-ibm"
// }

const MODULE_ID = 'release-assistant-2022-08-31-surveys';

const { getAcaMongoClient } = require('@ibm-aiap/aiap-mongo-client-provider');
const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { get } = require('./get');
const { transform } = require('./transform');
const { update } = require('./update');

const run = async (config) => {
  try {
    console.log('### SURVEYS UPDATE STARTED');
    console.time('time elapsed');
    const ACA_MONGO_CLIENT = getAcaMongoClient(config.app.client);

    const DB = await ACA_MONGO_CLIENT.getDB();

    const SURVEYS = await get(DB, { config });
    console.timeLog('time elapsed');

    const TRANSFORMED_SURVEYS = transform(SURVEYS, { config });
    console.timeLog('time elapsed');

    update(DB, { config, transformedSurveys: TRANSFORMED_SURVEYS });

    console.timeEnd('time elapsed');
    console.log('### SURVEYS UPDATE ENDED');
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    console.error('->', { ACA_ERROR });
    throw ACA_ERROR;
  }
};

module.exports = {
  run,
};
