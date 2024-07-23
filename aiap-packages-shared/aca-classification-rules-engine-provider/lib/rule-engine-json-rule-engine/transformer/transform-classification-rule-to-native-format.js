/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-classification-rules-engine-provider-json-rule-engine-transform-classification-rule-to-native-format`;
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');


// 2022-05-05 [LEGO] ---> Comment 
// const CONDITION_STRUCTURE = `{
//   id: string -> uuid, 
//   fact: { 
//     path: string, 
//   }, 
//   operator: { 
//     type: [equals, in] .....
//   }
//   value: any -> 
// }`;
// 

const ROOT_FACT_NAME = `document`;

const transformClassificationRuleToNativeFormat = (rule) => {
  let name;
  let conditions;
  try {
    name = rule?.name;
    conditions = rule?.conditions;
    if (
      !lodash.isArray(conditions)
    ) {
      const MESSAGE = `Wrong type of rule.conditions parameter!`;
      throwAcaError(MODULE_ID, ACA_ERROR_TYPE.SYSTEM_ERROR, MESSAGE);
    }
    const NATIVE_RULE_CONDITIONS = [];
    const RET_VAL = {
      name: name,
      event: {
        type: 'event',
        params: { rule }
      },
      conditions: {
        all: NATIVE_RULE_CONDITIONS
      },
    };
    conditions.forEach((condition) => {
      if (
        !lodash.isEmpty(condition)
      ) {
        NATIVE_RULE_CONDITIONS.push({
          fact: ROOT_FACT_NAME,
          path: condition.fact.path,
          operator: condition.operator.type,
          value: condition.value
        });
      }
    });
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(`${transformClassificationRuleToNativeFormat.name}`, { ACA_ERROR });
    throw ACA_ERROR;
  }
};



module.exports = {
  transformClassificationRuleToNativeFormat,
}
