/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { transformClassificationRuleToNativeFormat } = require('./transform-classification-rule-to-native-format');
const { transformClassificationRulesToNativeFormat } = require('./transform-classification-rules-to-native-format');

module.exports = {
    transformClassificationRuleToNativeFormat, 
    transformClassificationRulesToNativeFormat,
}
