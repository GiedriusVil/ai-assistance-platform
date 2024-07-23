/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-rules-engine-json-rule-engine-fact-item-field-groups';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const _createGroupTypes = (item) => {
   const ITEM_FIELD_GROUP_TYPES = {};

   const __createGroupTypeForObject = (object, prevPath = undefined, prevName = undefined) => {
      Object.keys(object).forEach(field => {
         const OBJ_FIELD_PATH = prevPath ? lodash.cloneDeep(prevPath) : [];
         OBJ_FIELD_PATH.push(field);
         const GROUP_TYPE_NAME = prevName ? `${prevName}_${field}` : field;
         const OBJ_FIELD = ramda.path([field], object);
         if (
            !lodash.isObject(OBJ_FIELD)
         ) {
            ITEM_FIELD_GROUP_TYPES[GROUP_TYPE_NAME] = {
               path: OBJ_FIELD_PATH,
               groups: []
            };
         } else {
            __createGroupTypeForObject(OBJ_FIELD, OBJ_FIELD_PATH, GROUP_TYPE_NAME);
         }
      });
   }

   if (
      !lodash.isEmpty(item)
   ) {
      __createGroupTypeForObject(item);
   }
   return ITEM_FIELD_GROUP_TYPES;
};

const _getGroupData = (item) => {
   if (
      !lodash.isEmpty(item)
   ) {
      const sellerId = ramda.path(['seller', 'extId'], item);
      const isSellerAuthorized = ramda.path(['isSellerAuthorized'], item).toString();
      const isFSI = ramda.path(['isFSI'], item);
      const itemId = ramda.path(['id'], item);
      const itemBase = ramda.pathOr(1, ['price', 'base', 'value'], item);
      const itemPrice = ramda.pathOr(0, ['price', 'money', 'value'], item);
      const itemQuantity = ramda.pathOr(0, ['quantity', 'value'], item);
      const sellerAmount = itemQuantity / itemBase * itemPrice;
      const sellerQuantity = ramda.path(['quantity', 'value'], item);
      const status = ramda.path(['status'], item);
      const RET_VAL = {
         sellerId,
         isSellerAuthorized,
         isFSI,
         itemId,
         sellerAmount,
         sellerQuantity,
         status
      };
      return RET_VAL;
   }
}

const _createItemGroup = (groups, item, fieldPath) => {
   if (
      !lodash.isEmpty(item) &&
      !lodash.isEmpty(fieldPath)
   ) {
      const GROUP_DATA = _getGroupData(item);

      const GROUPING_FIELD_VALUE = ramda.path(fieldPath, item);
      const EXISTING_ITEM_GROUP = groups.find(itemGroup => itemGroup.group.value === GROUPING_FIELD_VALUE);

      if (
         EXISTING_ITEM_GROUP
      ) {
         EXISTING_ITEM_GROUP.ids.push(item.id);
         EXISTING_ITEM_GROUP.totalAmount += GROUP_DATA.sellerAmount;
         EXISTING_ITEM_GROUP.totalQuantity += GROUP_DATA.sellerQuantity;
         EXISTING_ITEM_GROUP.isSellerAuthorized = GROUP_DATA.isSellerAuthorized;
         EXISTING_ITEM_GROUP.items.push({
            id: GROUP_DATA.itemId,
            isSellerAuthorized: GROUP_DATA.isSellerAuthorized,
            isFSI: GROUP_DATA.isFSI
         });
      } else {
         const NEW_ITEM_GROUP = {
            id: GROUP_DATA.sellerId,
            ids: [item.id],
            category: item.category,
            totalAmount: GROUP_DATA.sellerAmount,
            totalQuantity: GROUP_DATA.sellerQuantity,
            isSellerAuthorized: GROUP_DATA.isSellerAuthorized,
            items: [{
               id: GROUP_DATA.itemId,
               isSellerAuthorized: GROUP_DATA.isSellerAuthorized,
               isFSI: GROUP_DATA.isFSI
            }],
            group: {
               name: fieldPath.join('_'),
               path: fieldPath,
               value: GROUPING_FIELD_VALUE
            },
            status: GROUP_DATA.status
         };
         groups.push(NEW_ITEM_GROUP);
      }
   }
}

const _createItemGroups = (items, groupType) => {
   if (
      !lodash.isEmpty(items) &&
      !lodash.isEmpty(groupType)
   ) {
      const GROUP_ITEM_PATH = ramda.path(['path'], groupType);
      const ITEM_GROUPS = [];
      for (let item of items) {
         _createItemGroup(ITEM_GROUPS, item, GROUP_ITEM_PATH);
      }
      return ITEM_GROUPS;
   }
}

const _groupItemsForEachGroupType = (groupTypes, items) => {
   if (
      !lodash.isEmpty(groupTypes) &&
      !lodash.isEmpty(items)
   ) {
      const RET_VAL = groupTypes;
      Object.keys(RET_VAL).forEach(type => {
         const GROUP_TYPE = RET_VAL[type];
         GROUP_TYPE.groups = _createItemGroups(items, GROUP_TYPE);
      });
      return RET_VAL;
   }
};

class FactGroupByItemFields {

   static NAME = 'groupsByItemFields';

   static async addFactToAlmanac(params, almanac) {
      try {
         const ITEMS = await almanac.factValue('items');
         const ITEM = ramda.path([0], ITEMS);
         if (
            !lodash.isEmpty(ITEM)
         ) {
            const GROUP_TYPES = _createGroupTypes(ITEM);
            const RET_VAL = _groupItemsForEachGroupType(GROUP_TYPES, ITEMS);
            return RET_VAL;
         }
      } catch (error) {
         const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
         logger.info('addFactToAlmanac', ACA_ERROR);
         throw ACA_ERROR;
      }
   }

}

module.exports = {
   FactGroupByItemFields,
}
