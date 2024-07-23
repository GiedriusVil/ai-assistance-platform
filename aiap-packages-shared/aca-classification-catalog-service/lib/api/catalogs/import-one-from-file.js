/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = 'aca-classification-catalog-service-catalogs-import-one-from-file';
const logger = require('@ibm-aca/aca-common-logger')(MODULE_ID);

const lodash = require('@ibm-aca/aca-wrapper-lodash');
const ramda = require('@ibm-aca/aca-wrapper-ramda');

const { formatIntoAcaError } = require('@ibm-aca/aca-utils-errors');

const { readJsonFromFile } = require('./imports');

const {
  ACTION_STATUSES,
  ACTION_TYPES,
  saveOne: saveAction,
} = require('../actions');

const readSegmentFromFlatRecord = (catalogId, flatRecord) => {
  let retVal;
  if (
    !lodash.isEmpty(flatRecord)
  ) {
    const SEGMENT_ID = ramda.path(['segment'], flatRecord);
    const TITLE_EN = ramda.path(['segment_title_en'], flatRecord);
    const TITLE_FR = ramda.path(['segment_title_fr'], flatRecord);
    const SUPPLIER_NAME = ramda.path(['segment_supplier_name'], flatRecord);
    retVal = {
      catalogId: catalogId,
      id: `${catalogId}:${SEGMENT_ID}`,
      code: SEGMENT_ID,
      type: 'SEGMENT',
      title: {
        en: TITLE_EN,
        fr: TITLE_FR,
      },
      supplierName: SUPPLIER_NAME
    }
  }
  return retVal;
}

const readFamilyFromFlatRecord = (catalogId, flatRecord) => {
  let retVal;
  if (
    !lodash.isEmpty(flatRecord)
  ) {
    const SEGMENT_ID = ramda.path(['segment'], flatRecord);
    const FAMILY_ID = ramda.path(['family'], flatRecord);

    const TITLE_EN = ramda.path(['family_title_en'], flatRecord);
    const TITLE_FR = ramda.path(['family_title_fr'], flatRecord);
    const SUPPLIER_NAME = ramda.path(['family_supplier_name'], flatRecord);

    retVal = {
      catalogId: catalogId,
      segmentId: `${catalogId}:${SEGMENT_ID}`,
      id: `${catalogId}:${FAMILY_ID}`,
      code: FAMILY_ID,
      type: 'FAMILY',
      title: {
        en: TITLE_EN,
        fr: TITLE_FR,
      },
      supplierName: SUPPLIER_NAME
    }
  }
  return retVal;
}

const readClassFromFlatRecord = (catalogId, flatRecord) => {
  let retVal;
  if (
    !lodash.isEmpty(flatRecord)
  ) {
    const SEGMENT_ID = ramda.path(['segment'], flatRecord);
    const FAMILY_ID = ramda.path(['family'], flatRecord);
    const CLASS_ID = ramda.path(['class'], flatRecord);

    const TITLE_EN = ramda.path(['class_title_en'], flatRecord);
    const TITLE_FR = ramda.path(['class_title_fr'], flatRecord);
    const SUPPLIER_NAME = ramda.path(['class_supplier_name'], flatRecord);

    retVal = {
      catalogId: catalogId,
      segmentId: `${catalogId}:${SEGMENT_ID}`,
      familyId: `${catalogId}:${FAMILY_ID}`,
      id: `${catalogId}:${CLASS_ID}`,
      code: CLASS_ID,
      type: 'CLASS',
      title: {
        en: TITLE_EN,
        fr: TITLE_FR,
      },
      supplierName: SUPPLIER_NAME
    }
  }
  return retVal;
}

const readSubClassFromRecord = (catalogId, flatRecord) => {
  let retVal;
  if (
    !lodash.isEmpty(flatRecord)
  ) {
    const SEGMENT_ID = ramda.path(['segment'], flatRecord);
    const FAMILY_ID = ramda.path(['family'], flatRecord);
    const CLASS_ID = ramda.path(['class'], flatRecord);
    const SUB_CLASS_ID = ramda.path(['sub_class'], flatRecord);

    const TITLE_EN = ramda.path(['sub_class_title_en'], flatRecord);
    const TITLE_FR = ramda.path(['sub_class_title_fr'], flatRecord);
    const SUPPLIER_NAME = ramda.path(['sub_class_supplier_name'], flatRecord);

    retVal = {
      catalogId: catalogId,
      segmentId: `${catalogId}:${SEGMENT_ID}`,
      familyId: `${catalogId}:${FAMILY_ID}`,
      classId: `${catalogId}:${CLASS_ID}`,
      id: `${catalogId}:${SUB_CLASS_ID}`,
      code: SUB_CLASS_ID,
      type: 'SUB_CLASS',
      title: {
        en: TITLE_EN,
        fr: TITLE_FR,
      },
      supplierName: SUPPLIER_NAME
    }
  }
  return retVal;
}

const transformFlatRecordsToCategories = (catalogId, flatRecords) => {
  const RET_VAL = {
    segments: {},
    families: {},
    classes: {},
    subClasses: {},
  };
  if (
    lodash.isArray(flatRecords) &&
    !lodash.isEmpty(flatRecords)
  ) {
    for (let flatRecord of flatRecords) {
      let segment = readSegmentFromFlatRecord(catalogId, flatRecord);
      let family = readFamilyFromFlatRecord(catalogId, flatRecord);
      let clazz = readClassFromFlatRecord(catalogId, flatRecord);
      let subClass = readSubClassFromRecord(catalogId, flatRecord);

      if (
        !lodash.isEmpty(segment)
      ) {
        RET_VAL.segments[segment.id] = segment;
      }
      if (
        !lodash.isEmpty(family)
      ) {
        RET_VAL.families[family.id] = family;
      }
      if (
        !lodash.isEmpty(clazz)
      ) {
        RET_VAL.classes[clazz.id] = clazz;
      }
      if (
        !lodash.isEmpty(subClass)
      ) {
        RET_VAL.subClasses[subClass.id] = subClass;
      }
    }
  }
  return RET_VAL;
}

const segmentsService = require('../segments');
const familiesService = require('../families');
const classesService = require('../classes');
const subClassesService = require('../sub-classes');

const importOneFromFile = async (context, params) => {
  const PARAMS_FILE = params?.file;
  const PARAMS_CATALOG_ID = params?.catalogId;
  let action;
  try {
    const FLAT_RECORDS = await readJsonFromFile(PARAMS_FILE);

    const CATALOG = transformFlatRecordsToCategories(PARAMS_CATALOG_ID, FLAT_RECORDS);

    const SEGMENTS = Object.keys(CATALOG.segments).map((key) => CATALOG.segments[key]);
    const FAMILIES = Object.keys(CATALOG.families).map((key) => CATALOG.families[key]);
    const CLASSES = Object.keys(CATALOG.classes).map((key) => CATALOG.classes[key]);
    const SUB_CLASSES = Object.keys(CATALOG.subClasses).map((key) => CATALOG.subClasses[key]);

    const PROMISES = [];

    if (
      !lodash.isEmpty(SEGMENTS) &&
      lodash.isArray(SEGMENTS)
    ) {
      for (let segment of SEGMENTS) {
        PROMISES.push(
          segmentsService.saveOne(context, { segment })
        );
      }
    }
    if (
      !lodash.isEmpty(FAMILIES) &&
      lodash.isArray(FAMILIES)
    ) {
      for (let family of FAMILIES) {
        PROMISES.push(
          familiesService.saveOne(context, { family })
        );
      }
    }
    if (
      !lodash.isEmpty(CLASSES) &&
      lodash.isArray(CLASSES)
    ) {
      for (let clazz of CLASSES) {
        PROMISES.push(
          classesService.saveOne(context, { class: clazz })
        );
      }
    }
    if (
      !lodash.isEmpty(SUB_CLASSES) &&
      lodash.isArray(SUB_CLASSES)
    ) {
      for (let subClass of SUB_CLASSES) {
        PROMISES.push(
          subClassesService.saveOne(context, { subClass })
        );
      }
    }
    await Promise.all(PROMISES);
    action = {
      id: PARAMS_CATALOG_ID,
      status: ACTION_STATUSES.IDLE,
      type: ACTION_TYPES.CATALOG_IMPORT_FROM_FILE,
    };
    await saveAction(context, { action });

    const RET_VAL = {
      status: 'SUCCESS'
    };
    return RET_VAL;
  } catch (error) {
    const ACA_ERROR = formatIntoAcaError(MODULE_ID, error);
    logger.error(importOneFromFile.name, { ACA_ERROR });
    throw ACA_ERROR;
  }

}

module.exports = {
  importOneFromFile,
}
