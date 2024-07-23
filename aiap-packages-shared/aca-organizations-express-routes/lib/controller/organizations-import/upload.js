/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-organizations-express-routes-controller-organizations-import-upload';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const { constructActionContextFromRequest } = require('@ibm-aiap/aiap-utils-express-routes');
const { transformToAcaErrorFormat } = require('@ibm-aca/aca-data-transformer');
const { xlsToOrganizations } = require('@ibm-aiap/aiap-utils-xlsx');

const {
  organizationsService,
  organizationsImportService,
} = require('@ibm-aca/aca-organizations-service');

const uploadFile = async (request, response) => {
  const ERRORS = [];
  const CONTEXT = constructActionContextFromRequest(request);
  const ACTION = {
    create: 'CREATE',
    update: 'UPDATE',
    delete: 'DELETE'
  };
  let result;

  try {
    if (lodash.isEmpty(ERRORS)) {
      const IMPORT_FILE = request?.files?.organizationsFile;
      const ITEMS = await xlsToOrganizations(CONTEXT, IMPORT_FILE);
      logger.info('[uploadFile] ITEMS: ', { ITEMS });
      const PROMISES = [];

      if (!lodash.isEmpty(ITEMS)) {
        const DELETE_ITEMS = ITEMS.filter(item => item.action === ACTION.delete);
        if (!lodash.isEmpty(DELETE_ITEMS)) {
          DELETE_ITEMS.forEach(item => organizationsService.deleteOneById(CONTEXT, item.organization));
        }

        const CREATE_UPDATE_ITEMS = ITEMS.filter(
          item => item.action === ACTION.create || item.action === ACTION.update);
        if (!lodash.isEmpty(CREATE_UPDATE_ITEMS)) {
          CREATE_UPDATE_ITEMS.forEach(item => {
            PROMISES.push(organizationsImportService.saveOne(CONTEXT, item));
          });
        }
      }
      result = await Promise.all(PROMISES);
      logger.info('[uploadFile] result: ', { result });
    }
  } catch (error) {
    const ACA_ERROR = transformToAcaErrorFormat(MODULE_ID, error);
    ERRORS.push(ACA_ERROR);
  }
  if (lodash.isEmpty(ERRORS)) {
    response.status(200).json(result);
  } else {
    logger.error('->', { ERRORS });
    response.status(400).json(ERRORS);
  }
};

module.exports = {
  uploadFile,
};
