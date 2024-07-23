/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-json-rule-engine-fact-group-by-category';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors')

class FactGroupByCategory {

   static NAME = 'groupsByCategory';

   static async addFactToAlmanac(params, almanac) {
      try {
         const items = await almanac.factValue('items');
         const categories = items.map(item => item.categories);
         const mergedCategories = [].concat.apply([], categories);
         const uniqueCategories = [...new Set(mergedCategories)];
         const infoByCategory = [];
         if (
            !lodash.isEmpty(uniqueCategories)
         ) {
            uniqueCategories.forEach(category => {
               items.forEach(item => {
                  if (item.categories.includes(category)) {
                     const itemBase = ramda.path(['price', 'base', 'value'], item);
                     const itemPrice = ramda.path(['price', 'money', 'value'], item);
                     const itemQuantity = ramda.path(['quantity', 'value'], item);
                     const categoryAmount = itemQuantity / itemBase * itemPrice;
                     const categoryQuantity = ramda.path(['quantity', 'value'], item);
                     const foundInfo = infoByCategory.find(info => info.category == category);
                     if (foundInfo) {
                        foundInfo.ids.push(item.id)
                        foundInfo.totalAmount += categoryAmount;
                        foundInfo.totalQuantity += categoryQuantity
                     } else {
                        infoByCategory.push({
                           category: category,
                           ids: [item.id],
                           totalAmount: categoryAmount,
                           totalQuantity: categoryQuantity
                        });
                     }
                  }
               });
            });
            return infoByCategory;
         } else {
            const MESSAGE = "No 'items' factValue found for groupsByCategory fact creation!";
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE, { uniqueCategories });
         }
      } catch (error) {
         const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
         logger.error('addFactToAlmanac', { ACA_ERROR });
         throw ACA_ERROR;
      }
   }

}

module.exports = {
   FactGroupByCategory,
}
