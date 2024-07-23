/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-ai-test-executor-lib-executor-k-fold-modules-utils';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const dfd = require('@ibm-aca/aca-wrapper-danfojs-node');

const checkIntentsForThreshold = (list, threshold, conditionArray) => {
  let retVal = [];
  for (let value in list) {
    if (list[value] < threshold) {
      list[value] = 'BELOW_THRESHOLD'
      retVal.push(list[value])
    }
    else {
      list[value] = conditionArray[value];
      retVal.push(list[value]);
    }
  }
  return retVal;
}

const convertDataframeToDictionary = (dataframe, orient = 'records') => {
  const DATA = dataframe?.values;
  const COLUMNS = dataframe?.columns;
  const COL_DATA = dataframe?.$dataIncolumnFormat;
  let retVal = [];
  let result = {};
  orient = orient.toLowerCase();
  if (orient === 'records') {
    for (let i = 0; i < DATA.length; i++) {
      for (let k = 0; k < DATA[i].length; k++) {
        let key = COLUMNS[k];
        let value = DATA[i][k];
        result[key] = value;
      }
      retVal.push(result);
      result = {};
    }
    return retVal
  }
  if (orient === 'list') {
    for (let i = 0; i < COLUMNS.length; i++) {
      let key = COLUMNS[i];
      let value = COL_DATA[i];
      result[key] = value;
    }
    return result;
  }
}

const transformAndFilterResults = (items) => {
  const ITEMS_WITHOUT_ACCURACY = lodash.omit(items, 'accuracy');
  let retVal = [];
  let blacklist = ['weighted avg', 'BELOW_THRESHOLD', 'micro avg', 'macro avg'];
  for (let [name, value] of Object.entries(ITEMS_WITHOUT_ACCURACY)) {
    value['name'] = name;
    retVal.push(value);
  }
  let filtered = retVal.filter(item => { return !blacklist.includes(item.name) });
  return filtered;
}

const convertIntentsToDataframe = (intents) => {
  let dummyData = [[2, 3]];
  let dataframe = new dfd.DataFrame(dummyData, { columns: ['intent', 'text'] });
  let index = 1;
  for (const intent of intents) {
    const INTENT_NAME = intent?.external?.intent;
    const INTENT_EXAMPLES = intent?.external?.examples;
    for (const intentExample in INTENT_EXAMPLES) {
      const INTENT_EXAMPLE_TEXT = INTENT_EXAMPLES?.[intentExample]?.text;
      dataframe = dataframe.append([[INTENT_NAME, INTENT_EXAMPLE_TEXT]], [index]);
      index++;
    }

  }
  dataframe.drop({ index: [0], axis: 0, inplace: true });
  dataframe = dataframe.resetIndex();
  return dataframe;
}

const transformSynonymsToStringArray = (entities) => {
  let retVal = [];
  entities?.forEach(entity => {
    let values = [];
    entity?.external?.values?.forEach(value => {
      let string = lodash.map(value.synonyms, 'synonym');
      let val = {
        value: value.value,
        type: 'synonyms',
        synonyms: string
      }
      values.push(val);

    })
    retVal.push({
      entity: entity?.external?.entity,
      values: values
    })

  })
  return retVal;
}

const convertMatrixDataToIntents = (confusionMatrix) => {
  let data = confusionMatrix?.matrix;
  let labels = confusionMatrix?.labels;
  let matrixData = [];
  for (let i = 0; i < labels.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (labels[i] !== labels[j] && data[i][j] > 0) {
        matrixData.push({
          actualIntent: labels[i],
          predictedIntent: labels[j],
          value: data[i][j],
          uniqueText: `${labels[j]}:${labels[i]}:${data[i][j]}`
        });
      }
    }
  }
  return matrixData;
}

const retrieveDataframeColumnDataByName = (dataframe, name) => {
  const DATAFRAME_COLUMNS_NAMES = dataframe?.columns;
  const COLUMN_VALUE_INDEX = DATAFRAME_COLUMNS_NAMES.indexOf(name);
  const DATAFRAME_COLUMN_VALUE = dataframe?.$dataIncolumnFormat?.[COLUMN_VALUE_INDEX];
  return DATAFRAME_COLUMN_VALUE;

}

const retrieveIntentsFromDataframe = async (dataframe, trainIndex) => {
  let intentResults = [];
  for (let index = 0; index < trainIndex.length; index++) {
    let row = {};
    let text = retrieveDataByName('text', dataframe, trainIndex, index);
    let intent = retrieveDataByName('intent', dataframe, trainIndex, index);
    for (let k = 0; k <= intentResults.length; k++) {
      if (!lodash.some(intentResults, { 'intent': intent })) {
        row = {
          'intent': intent,
          'examples': [{ 'text': text }]
        };
      } else {
        const ROW_INDEX = intentResults.findIndex(intentItem => intentItem['intent'] == intent);
        row = intentResults[ROW_INDEX];
        const IS_ITEM_EXIST = intentResults.some(intentItem => {
          const CONDITION = intentItem['examples'].find(example => example.text == text);
          return CONDITION;
        });
        if (!IS_ITEM_EXIST) {
          const TEXT = { 'text': text };
          row['examples'].push(TEXT);
        }
      }
    }
    intentResults.push(row);
  }
  const UNIQUE_RESULT = lodash.uniqBy(intentResults, 'intent');
  return UNIQUE_RESULT;
}

const retrieveDataByName = (fieldName, dataframe, trainIndex, index) => {
  const DATAFRAME_COLUMNS = dataframe?.columns;
  const COLUMN_VALUE_INDEX = DATAFRAME_COLUMNS.indexOf(fieldName);
  const DATAFRAME = dataframe.iloc({ rows: [trainIndex[index]] });
  const DATAFRAME_COLUMN_VALUE = DATAFRAME?.$dataIncolumnFormat?.[COLUMN_VALUE_INDEX];
  let retVal = DATAFRAME_COLUMN_VALUE.toString();
  return retVal;
}

const compareActualAndPredictedIntentLabels = (actualIntentLabels, predictedIntentLabels) => {
  if (predictedIntentLabels.lenght !== actualIntentLabels.length) {
    const LABELS_DIFFERENCE = lodash.difference(predictedIntentLabels, actualIntentLabels);
    const LABELS_INTERSECTION = lodash.intersection(predictedIntentLabels, actualIntentLabels);
    return {
      predictedIntents: LABELS_INTERSECTION,
      labelsDifference: {
        unhittedIntents: LABELS_DIFFERENCE
      }
    }
  } else {
    return {
      predictedIntents: predictedIntentLabels,
      labelsDifference: {
        unhittedIntents: []
      }
    }
  }

}

module.exports = {
  checkIntentsForThreshold,
  convertDataframeToDictionary,
  transformAndFilterResults,
  convertMatrixDataToIntents,
  convertIntentsToDataframe,
  transformSynonymsToStringArray,
  retrieveIntentsFromDataframe,
  retrieveDataframeColumnDataByName,
  compareActualAndPredictedIntentLabels
}
