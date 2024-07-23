/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export const QUERY_EXAMPLE_TRANSFORM_RESULTS = `
#### Data Transform
  
\`\`\`javascript
const {
  constructMonthsListFromQuery,
  mapDataToMonthList
} = require('@ibm-aiap/aiap-utils-date');

const transformResults = (context, params) => {
  const RESPONSE = params?.qResults?.conversationsByDay;
  const MONTH_LIST = constructMonthsListFromQuery(params.query);
  const LABELS = MONTH_LIST.map((item) => item.label);
  const DATASET = mapDataToMonthList(MONTH_LIST, RESPONSE);
  const RET_VAL = {
    labels: LABELS,
    dataset: DATASET
  };
  return RET_VAL;
}

#### Top Intents

const transformResults = (context, params) => {
  const RESPONSE = params?.qResults?.topIntents;
  const LABELS = RESPONSE.map((response: any) => '#' + response.intent);
  const DATASET = RESPONSE.map((response: any) => response.total);
  const RET_VAL = {
    labels: LABELS,
    dataset: DATASET
  };
  return RET_VAL;
}

\`\`\`
`;
