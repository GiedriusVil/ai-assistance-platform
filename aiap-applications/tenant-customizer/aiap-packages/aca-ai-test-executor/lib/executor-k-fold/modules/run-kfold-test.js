/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const MODULE_ID = 'aca-testing-app-app-packages-modules-run-kfold-test';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);
const ramda = require('@ibm-aca/aca-wrapper-ramda');
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const dfd = require('@ibm-aca/aca-wrapper-danfojs-node');

const { retrieveDataframeColumnDataByName } = require('./utils');

const testKfold = async (context, params, options) => {

    const TEST_DATAFRAME = options?.testDataframe;
    const FOLD_INDEX = options?.foldIndex;
    const WORKSPACES = options?.workspaces;
    const ASSISTANT = options?.assistant;
    let results = new dfd.DataFrame([[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]], {
        columns: [
            'originalText', 'predictedIntent', 'actualIntent1',
            'actualConfidence1', 'actualIntent2', 'actualConfidence2',
            'actualIntent3', 'actualConfidence3', 'entities', 'intentsMatch',
            'foldNumber','uniqueText'
        ]
    });
    const TEST_DATAFRAME_DATA = TEST_DATAFRAME?.values;
    let index = 1;
    for (let i in lodash.range(TEST_DATAFRAME_DATA.length)) {
        const DATAFRAME_TEXT_COLUMN = retrieveDataframeColumnDataByName(TEST_DATAFRAME, 'text');
        const TEXT = DATAFRAME_TEXT_COLUMN?.[i];
        const MESSAGE_PARAMS = {
          request: {
            workspaceId: WORKSPACES[FOLD_INDEX],
            input: {
              text: TEXT
            }
          }
        };
        let response = await ASSISTANT.messages.sendOneForTest(context, MESSAGE_PARAMS);
        let data = response.result;
        let intent1 = ramda.pathOr('N/A', ['intents', 0, 'intent'], data);
        let intent2 = ramda.pathOr('N/A', ['intents', 1, 'intent'], data);
        let intent3 = ramda.pathOr('N/A', ['intents', 2, 'intent'], data);
        let confidence1 = ramda.pathOr(0, ['intents', 0, 'confidence'], data);
        let confidence2 = ramda.pathOr(0, ['intents', 1, 'confidence'], data);
        let confidence3 = ramda.pathOr(0, ['intents', 2, 'confidence'], data);
        let entities = ramda.pathOr([], ['entities'], data);
        const INTENT_FROM_DATAFRAME = retrieveDataframeColumnDataByName(TEST_DATAFRAME, 'intent');
        let intentsMatch = INTENT_FROM_DATAFRAME[i] === intent1 ? 'Yes' : 'No';
        const UNIQUE_TEXT = `${confidence1}:${TEXT}:${intent1}:${INTENT_FROM_DATAFRAME[i]}`;
        const DATA_TO_APPEND = [
            TEXT,
            INTENT_FROM_DATAFRAME[i],
            intent1,
            confidence1,
            intent2,
            confidence2,
            intent3,
            confidence3,
            entities,
            intentsMatch,
            FOLD_INDEX + 1,
            UNIQUE_TEXT];
        results = results.append([DATA_TO_APPEND], [index]);
        index++;
    }
    results.drop({ index: [0], axis: 0, inplace: true });
    results = results.resetIndex();
    return results;
}

const runKFoldTest = async (context, params, options) => {
    try {
        const FOLDS = options?.folds;
        const INTENTS = options?.intents;
        const WORKSPACES = options?.workspaces;
        const ASSISTANT = options?.assistant;
        let testResults = [];
        for (let i in lodash.range(FOLDS.length)) {
            let index = parseInt(i);
            const TEST_INDEX = FOLDS[index]['test'];
            const DF_TESTS = INTENTS.iloc({ rows: TEST_INDEX });
            const DF_TEST_REINDEXED = DF_TESTS.resetIndex();
            const RESULTS = await testKfold(context, params, {
               testDataframe: DF_TEST_REINDEXED,
               foldIndex: index,
               workspaces: WORKSPACES,
               assistant: ASSISTANT
            });
            testResults.push(RESULTS);
    }
        return testResults;
    } catch (error) {
        const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
        logger.error('->', ACA_ERROR);
        throw ACA_ERROR;
    }
}
module.exports = { runKFoldTest, testKfold }
