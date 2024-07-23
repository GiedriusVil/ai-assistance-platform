/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'utils-xlsx-transactions-to-excel';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const excelJS = require('exceljs');

import lodash from '@ibm-aca/aca-wrapper-lodash';

import {
  formatIntoAcaError,
} from '@ibm-aca/aca-utils-errors';

import {
  TRANSACTIONS_XLS_SCHEMA,
} from './schema';

const TEMPLATE_LOC = `${__dirname}/transactions.xlsx`;

const transactionToRows = (
  purchaseRequest: any,
  prIteration: any,
  prTransaction: any,
) => {
  const RET_VAL = [];

  const TRANSACTION_ITEMS = prTransaction?.items;

  for (const ITEM of TRANSACTION_ITEMS) {
    const ITEM_AS_XLS_ROW = itemToRow(purchaseRequest, prIteration, prTransaction, ITEM);
    RET_VAL.push(ITEM_AS_XLS_ROW);
  }

  return RET_VAL;
}

const itemToRow = (
  purchaseRequest: any,
  prIteration: any,
  prTransaction: any,
  prItem: any,
) => {
  const STEPS = lodash.keyBy(prTransaction?.steps, 'action');
  const REQUEST_RECEIVED = STEPS['REQUEST_RECEIVED'];
  const RESPONSE_READY = STEPS['RESPONSE_READY'];
  const RESPONSE_TRANSFORMED = STEPS['RESPONSE_TRANSFORMED'];

  const RECEIVED_TIME = REQUEST_RECEIVED?.created?.date;
  const RESPONDED_TIME = RESPONSE_TRANSFORMED?.created?.date;
  const ELAPSED_TIME = cycleTime(RECEIVED_TIME, RESPONDED_TIME);

  const VALIDATION_RESULT = RESPONSE_READY?.doc;
  const VALIDATION_ACTIONS = validationActions(VALIDATION_RESULT);
  const VALIDATION_MESSAGES = validationMessagesCodes(VALIDATION_RESULT);

  const RET_VAL = {
    id: prTransaction?.prId || '',
    userID: prTransaction.organization?.extId || '',
    country: prTransaction?.country || '',
    org: prTransaction.organization?.name || '',
    sellerId: prItem?.seller?.extId || '',
    sellerName: prItem?.seller?.name || '',
    unspcsCode: prItem?.category || '',
    unspcsCodeDescr: prItem?.categoryText || '',
    itemNo: prItem?.id,
    itemCount: prTransaction?.items?.length || '',
    arrivalTime: RECEIVED_TIME || '',
    completionTime: RESPONDED_TIME || '',
    elapsedTime: `${ELAPSED_TIME} s` || '',
    totalValidations: purchaseRequest?.validations?.length || '',
    iterationIndex: parseInt(prIteration) + 1 || '',
    action: VALIDATION_ACTIONS.toString() || '',
    messageCode: VALIDATION_MESSAGES.toString() || '',
  };
  return RET_VAL;
}

const cycleTime = (
  start: any,
  end: any,
) => {
  const START_DATE = new Date(start);
  const END_DATE = new Date(end);
  const RET_VAL = (END_DATE.getTime() - START_DATE.getTime()) / 1000;
  return RET_VAL;
}

const validationActions = (
  validationResult: any,
) => {
  const ACTION_CODES = [];
  const VALIDATION_RESULTS = jointValidationResults(validationResult);
  for (const RESULT_ITEM of VALIDATION_RESULTS) {
    const ACTIONS = _convertSingleToArray(RESULT_ITEM.actions);
    ACTION_CODES.push(...ACTIONS);
  }
  const RET_VAL = lodash.uniq(ACTION_CODES);
  return RET_VAL;
}

const validationMessagesCodes = (
  validationResult: any,
) => {
  const MESSAGE_CODES = [];
  const VALIDATION_RESULTS = jointValidationResults(validationResult);

  for (const RESULT_ITEM of VALIDATION_RESULTS) {
    const CODES = _convertSingleToArray(RESULT_ITEM.messageCode);
    MESSAGE_CODES.push(...CODES);
  }

  const RET_VAL = lodash.uniq(MESSAGE_CODES);
  return RET_VAL;
}

const jointValidationResults = (
  validationResult: any,
) => {
  const HEADER_VALIDATION_RESULTS = validationResult?.headerValidationResults || [];
  const GROUP_VALIDATION_RESULTS = validationResult?.groupValidationResults || [];
  const ITEM_VALIDATION_RESULTS = validationResult?.itemValidationResults || [];
  const FULL_VALIDATION_RESULTS = lodash.concat(HEADER_VALIDATION_RESULTS, GROUP_VALIDATION_RESULTS, ITEM_VALIDATION_RESULTS);
  return FULL_VALIDATION_RESULTS;
}

const addCellFormattingOptions = (
  sheet: any,
) => {
  sheet.eachRow((row, rowNumber) => {

    if (rowNumber == 1) {
      row.getCell('P').alignment = {
        wrapText: true,
      };
    }

    if (rowNumber > 1) {
      row.getCell('F').alignment = {
        wrapText: true,
      };
      row.getCell('K').numFmt = 'yyyy-mm-dd hh:mm:ss';
      row.getCell('L').numFmt = 'yyyy-mm-dd hh:mm:ss';
      row.getCell('M').alignment = {
        horizontal: 'right',
      };

      row.eachCell((cell) => {
        if (rowNumber % 2 != 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'A6CDEF' },
          }
        }
      });
    }
  });
};

const _convertSingleToArray = (
  item: any,
) => {
  if (lodash.isArray(item)) {
    const RET_VAL = lodash.cloneDeep(item);
    return RET_VAL;
  }

  const RET_VAL = [lodash.cloneDeep(item)];

  return RET_VAL;
}

export const transactionsToXls = async (
  context: any,
  purchaseRequests: any,
) => {

  try {
    const WORKBOOK = new excelJS.Workbook();
    await WORKBOOK.xlsx.readFile(TEMPLATE_LOC);
    const SHEET = WORKBOOK.getWorksheet('Sheet1');
    SHEET.columns = TRANSACTIONS_XLS_SCHEMA;

    for (const PURCHASE_REQUEST of purchaseRequests) {

      const _PR_TRANSACTIONS = PURCHASE_REQUEST?.validations || [];
      const PR_TRANSACTIONS = lodash.sortBy(_PR_TRANSACTIONS, 'timestamp');

      for (const TRANSACTION_INDEX in PR_TRANSACTIONS) {

        const TRANSACTION = PR_TRANSACTIONS[TRANSACTION_INDEX];
        const TRANSACTION_AS_XLS_ROWS = transactionToRows(PURCHASE_REQUEST, TRANSACTION_INDEX, TRANSACTION);
        SHEET.addRows(TRANSACTION_AS_XLS_ROWS);
      }
    }
    addCellFormattingOptions(SHEET);
    const RET_VAL = WORKBOOK.xlsx.writeBuffer();
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(transactionsToXls.name, { ACA_ERROR });
    throw ACA_ERROR;
  }
}

