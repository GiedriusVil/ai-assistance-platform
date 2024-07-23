/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-json-rule-engine-fact-group-by-seller';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError, throwAcaError, ACA_ERROR_TYPE } = require('@ibm-aca/aca-utils-errors');

class FactGroupBySeller {

   static NAME = 'groupsBySeller';

   static async addFactToAlmanac(params, almanac) {
      try {
         const items = await almanac.factValue('items');
         const infoBySeller = [];
         if(!lodash.isEmpty(items)){
            items.forEach(item => {
               const sellerId = ramda.path(['seller', 'extId'], item);
               const isSellerAuthorized = ramda.path(['isSellerAuthorized'], item).toString();
               const isFSI = ramda.path(['isFSI'], item);
               const itemId = ramda.path(['id'], item);
               const itemBase = ramda.path(['price', 'base', 'value'], item) || 1;
               const itemPrice = ramda.path(['price', 'money', 'value'], item) || 0;
               const itemQuantity = ramda.path(['quantity', 'value'], item) || 1;
               const sellerAmount = itemQuantity / itemBase * itemPrice;
               const sellerQuantity = ramda.path(['quantity', 'value'], item);
               const seller = infoBySeller.find(seller => seller.id === sellerId);
               if(seller){
                  seller.ids.push(item.id);
                  seller.totalAmount += sellerAmount;
                  seller.totalQuantity += sellerQuantity;
                  seller.isSellerAuthorized = isSellerAuthorized;
                  seller.items.push({
                     id: itemId,
                     isSellerAuthorized: isSellerAuthorized,
                     isFSI: isFSI
                  });
               } else {
                  infoBySeller.push({
                     id: sellerId,
                     ids: [item.id],
                     totalAmount: sellerAmount,
                     totalQuantity: sellerQuantity,
                     isSellerAuthorized: isSellerAuthorized,
                     items: [{
                        id: itemId,
                        isSellerAuthorized: isSellerAuthorized,
                        isFSI: isFSI
                     }],
                  });
               }
            });
            return infoBySeller
         } else {
            const MESSAGE = `No 'items' factValue found for 'groupsBySeller' fact creation!`;
            throwAcaError(MODULE_ID, ACA_ERROR_TYPE.VALIDATION_ERROR, MESSAGE);
         }
      } catch(error) {
         const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
         logger.info('->', ACA_ERROR);
         throw ACA_ERROR;
      }
   }
}

module.exports = {
    FactGroupBySeller,
}
