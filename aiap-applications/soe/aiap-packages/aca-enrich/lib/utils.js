/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const R = require('@ibm-aca/aca-wrapper-ramda');

// Turn an object into a list by taking the key and putting it into subobjects using propname
const listFromObject = R.curry((keyPropName, obj) => {
  const list = [];
  R.mapObjIndexed((value, key) => {
    value[keyPropName] = key;
    list.push(value);
  }, obj);
  return list;
});

const named = listFromObject('name');
const isObjLiteral = val => (val ? val.constructor === {}.constructor : false);
const isSync = R.allPass([
  R.compose(
    R.not,
    R.isNil
  ),
  isObjLiteral,
]);

module.exports = {
  named,
  isSync,
};
