/*
   © Copyright IBM Corporation 2022. All Rights Reserved 
    
   SPDX-License-Identifier: EPL-2.0
*/
const { addOperatorEqual } = require('./add-operator-equal');
const { addOperatorNotEqual } = require('./add-operator-not-equal');

const { addOperatorIn } = require('./add-operator-in');
const { addOperatorNotIn } = require('./add-operator-not-in');

const { addOperatorContains } = require('./add-operator-contains');
const { addOperatorDoesNotContain } = require('./add-operator-does-not-contain');

const { addOperatorLessThan } = require('./add-operator-less-than');
const { addOperatorLessThanInclusive } = require('./add-operator-less-than-inclusive');

const { addOperatorGreaterThan } = require('./add-operator-greater-than');
const { addOperatorGreaterThanInclusive } = require('./add-operator-greater-than-inclusive');

const OPERATORS = [];

addOperatorEqual(OPERATORS);
addOperatorNotEqual(OPERATORS);

addOperatorIn(OPERATORS);
addOperatorNotIn(OPERATORS);

addOperatorContains(OPERATORS);
addOperatorDoesNotContain(OPERATORS);

addOperatorLessThan(OPERATORS);
addOperatorLessThanInclusive(OPERATORS);

addOperatorGreaterThan(OPERATORS);
addOperatorGreaterThanInclusive(OPERATORS);

module.exports = {
  OPERATORS,
};
