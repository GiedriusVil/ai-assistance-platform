/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const lodash = require('@ibm-aca/aca-wrapper-lodash');

const FILTER_PATHS = {
  APPLICATION_FILTER: 'metadata.source.Sovellus.Label',
  PLATFORM_FILTER: 'metadata.source.Kayttojarjestelma.Label',
}

const transform = result => {
  let retVal = [];
  result.forEach(element => {
    delete element.enriched_title;
    delete element.enriched_text;
    retVal.push(element);
  });
  return retVal;
};

const filterParamsTransform = (filterType, filter) => {
  let filterArray = [];
  const TYPE = filterType.split(',');
  const PARAM = filter.split(',');

  TYPE.forEach((type, index) => {
    const STR = type.replace(/\s/g, '');
    const FILTER = PARAM[index].replace(/\s/g, '');
    let filterObj = {};
    filterObj[STR] = FILTER;
    filterArray.push(filterObj);
  })
  return filterArray;
}

const constructFilter = (filterPath, filterOptions) => {
  let retVal = '';
  if (!lodash.isNil(filterOptions) && !lodash.isEmpty(filterOptions)) {
    const FILTER_OPTIONS = filterOptions.split('|');
    if (FILTER_OPTIONS.length > 1) {
      retVal = retVal + '(';
      FILTER_OPTIONS.forEach((option, index) => {
        retVal = retVal + filterPath + ':' + option;
        if (index != FILTER_OPTIONS.length - 1) {
          retVal = retVal + '|';
        } else {
          retVal = retVal + ')';
        }
      })
    } else {
      retVal = retVal + filterPath + ':' + FILTER_OPTIONS;
    }
  } else {
    //using 'exists' operator if filter type was defined but filter options not provided
    retVal = filterPath + ':*';
  }
  return retVal;
}

const searchFilter = (filterParams) => {
  let filterString = '';
  filterParams.forEach((filter, index) => {
    const KEY = Object.keys(filter)[0];
    if (index != 0) {
      filterString = filterString + ',';
    }
    let appFilter;
    let platformFilter;
    switch (KEY) {
      case 'application':
        appFilter = constructFilter(FILTER_PATHS.APPLICATION_FILTER, filter[KEY]);
        filterString = filterString + appFilter;
        break;
      case 'platform':
        platformFilter = constructFilter(FILTER_PATHS.PLATFORM_FILTER, filter[KEY]);
        filterString = filterString + platformFilter;
        break;
      case 'custom':
        filterString = filterString + filter[KEY];
        break;
      default:
        break;
    }
  })
  return filterString;
}

module.exports = {
  transform,
  filterParamsTransform,
  searchFilter
};
