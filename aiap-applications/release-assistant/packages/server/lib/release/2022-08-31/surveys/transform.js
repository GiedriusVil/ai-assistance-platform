/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const changeSurveyValue = (value) => {
  let retVal;
  if (lodash.isEmpty(value)) {
    throw new Error('Survey score is empty!');
  }
  if (lodash.isNumber(value)) {
    return value;
  } else if (lodash)
  switch (value) {
    case 'Very Dissatisfied':
      retVal = -2;
      break;
    case 'Dissatisfied':
      retVal = -1;
      break;
    case 'Neutral':
      retVal = 0;
      break;
    case 'Satisfied':
      retVal = 1;
      break;
    case 'Very Satisfied':
      retVal = 2;
      break;
    default:
      throw new Error(`No matching value for ${value}`);
  }

  return retVal;
};

const transform = (surveys, params) => {
  const CONFIG = params.config;
  const TENANT_ID = CONFIG.app.tenantId

  const RET_VAL = surveys.map((survey) => {
    // if (survey._processed_2022_08_31) {
    //   return survey;
    // }

    if (!lodash.isEmpty(survey.assistant)) {
      survey.assistantId = survey.assistant;
      delete survey.assistant;
    }

    if (!lodash.isEmpty(survey.tenant)) {
      survey.tenantId = survey.tenant;
      delete survey.tenant;
    } else if (lodash.isEmpty(survey.tenantId)) {
      survey.tenantId = TENANT_ID;
    }

    if (!lodash.isEmpty(survey.score)) {
      const SCORE = changeSurveyValue(survey.score);
      survey.score = SCORE;
    }

    if (!lodash.isEmpty(survey.conversation_score)) {
      const SCORE = changeSurveyValue(survey.conversation_score);
      survey.score = SCORE;
      delete survey.conversation_score;
    };

    survey._processed_2022_08_31 = true;

    return survey;
  });

  return RET_VAL;
};

module.exports = {
  transform,
};
