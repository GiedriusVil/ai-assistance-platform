/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const { addOperatorAllItemsAreFsi } = require('./add-operator-all-items-are-fsi');
const { addOperatorEqual } = require('./add-operator-equal');
const { addOperatorIn } = require('./add-operator-in');
const { addOperatorIsEmpty } = require('./add-operator-is-empty');
const { addOperatorNotEqual } = require('./add-operator-not-equal');
const { addOperatorNotIn } = require('./add-operator-not-in');
const { addOperatorSingularSellerAmountExceeds } = require('./add-operator-singular-seller-amount-exceeds');
const { addOperatorSingularSellerQuantityExceeds } = require('./add-operator-singular-seller-quantity-exceeds');
const { addOperatorTotalItemAmountExceeds } = require('./add-operator-total-item-amount-exceeds');
const { addOperatorTotalItemAmountLessThan } = require('./add-operator-total-item-amount-less-than');

const OPERATORS = [];

addOperatorAllItemsAreFsi(OPERATORS);
addOperatorEqual(OPERATORS);
addOperatorIn(OPERATORS);
addOperatorIsEmpty(OPERATORS);
addOperatorNotEqual(OPERATORS);
addOperatorNotIn(OPERATORS);
addOperatorSingularSellerAmountExceeds(OPERATORS);
addOperatorSingularSellerQuantityExceeds(OPERATORS);
addOperatorTotalItemAmountExceeds(OPERATORS);
addOperatorTotalItemAmountLessThan(OPERATORS);

module.exports = {
  OPERATORS,
}
