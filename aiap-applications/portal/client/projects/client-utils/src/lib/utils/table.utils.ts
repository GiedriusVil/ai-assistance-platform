/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { TableItem, TableModel } from 'client-shared-carbon';

import * as ramda from 'ramda';
import * as lodash from 'lodash';
import * as uuid from 'uuid';

import { _debug, _debugX } from 'client-shared-utils';

export function defaultQuery() {
  const TO_DATE = new Date();
  const FROM_DATE = new Date();
  FROM_DATE.setTime(TO_DATE.getTime());
  FROM_DATE.setDate(TO_DATE.getDate() - 1);
  const RET_VAL: any = {
    filter: {
      dateRange: {
        from: FROM_DATE,
        to: TO_DATE,
        mode: 'day'
      },
    },
    sort: {
      field: 'id',
      direction: 'asc'
    },
    pagination: {
      page: 1,
      size: 10,
    }
  };
  return RET_VAL;
}

/** Adapter to handle two types of request events */
function eventRequestAdapter(queryEvent) {
  let retVal;
  if (queryEvent.query) {
    retVal = queryEvent.query;
  } else {
    retVal = queryEvent;
  }

  return retVal;
}

/** Adapter to handle two types of response events */
function eventResponseAdapter(currQuery, queryEvent) {
  let retVal;
  if (queryEvent.options) {
    retVal = {
      query: currQuery,
      options: queryEvent.options
    };
  } else {
    retVal = queryEvent;
  }
  return retVal;
}

export function handleSortByHeader(eventService: any, model: any, query: any, index: any, isModal: boolean = false) {
  const SORT_HEADER = ramda.path(['header', index], model);
  _debug('HANDLE_SORT_BY_HEADER', { SORT_HEADER });

  const REQUEST_QUERY = eventRequestAdapter(query);
  if (
    !SORT_HEADER.sorted
  ) {
    SORT_HEADER.sorted = true;
    SORT_HEADER.ascending = true;
    REQUEST_QUERY.sort = {
      field: SORT_HEADER.field,
      direction: 'asc'
    }
  } else if (
    SORT_HEADER.sorted &&
    SORT_HEADER.ascending
  ) {
    SORT_HEADER.ascending = false;
    REQUEST_QUERY.sort = {
      field: SORT_HEADER.field,
      direction: 'desc'
    }
  } else {
    SORT_HEADER.sorted = false;
  }
  const HEADERS = ramda.path(['header'], model);
  for (let header of HEADERS) {
    if (
      header &&
      SORT_HEADER &&
      header.data !== SORT_HEADER.data
    ) {
      header.sorted = false;
    }
  }

  const RESPONSE_QUERY = eventResponseAdapter(REQUEST_QUERY, query);
  if (isModal) {
    eventService.modalFilterEmit(RESPONSE_QUERY);
  } else {
    eventService.filterEmit(RESPONSE_QUERY);
  }
}

/** Handles pageLength and pagination */
export function handlePageChangeEvent(eventService: any, model: any, query: any, page: any, isModal: boolean = false) {
  _debug('HANDLE_PAGE_CHANGE_EVENT', {
    page: page,
    size: model.pageLength
  });

  const REQUEST_QUERY = eventRequestAdapter(query);

  REQUEST_QUERY.pagination.page = page;
  REQUEST_QUERY.pagination.size = model.pageLength;

  const RESPONSE_QUERY = eventResponseAdapter(REQUEST_QUERY, query);

  if (isModal) {
    eventService.modalFilterEmit(RESPONSE_QUERY);
  } else {
    eventService.filterEmit(RESPONSE_QUERY);
  }
}

/** If page is not a number, then default value will be 1 */
export function parsePageNumberFromURL(page: string): number {
  let selectedPage = 1;

  if (!ramda.isNil(page)) {
    selectedPage = Number(page);
  }

  return selectedPage;
}

/** Updates page number at URL */
export function navigateToPage(router, activatedRouter, pageNumber: number): void {
  router.navigate([], {
    relativeTo: activatedRouter,
    queryParams: {
      page: pageNumber
    },
    queryParamsHandling: 'merge',
  });
}

export function sanitizeIBMOverflowMenuPaneElement(className: string, document: Document): void {
  if (document) {
    const LAST_ELEMENT = document.body.lastElementChild;
    _debugX(className, '_sanitizeIBMOverflowMenuPaneElement', { LAST_ELEMENT });
    const LAST_ELEMENT_NAME = ramda.path(['localName'], LAST_ELEMENT);
    if (
      'ibm-overflow-menu-pane' === LAST_ELEMENT_NAME
    ) {
      document.body.removeChild(LAST_ELEMENT);
      _debugX(className, '_sanitizeIBMOverflowMenuPaneElement', { status: 'SANITIZED' });
    }
  }
}

export const trackByIndex = (index: number, item: any) => index;

//< DEPRECATED
/** Create page array */
const getPage = (page: number, model: TableModel): Array<Array<any>> => {
  const fullPage: Array<Array<any>> = [];

  for (let i = (page - 1) * model.pageLength; i < page * model.pageLength && i < model.totalDataLength; i++) {
    fullPage.push([model.data[i]]);
  }

  return fullPage;
}

/** Create new data from the service data and uses key to get item from object */
const prepareData = (data: Array<Array<any>>, key: string, value: string): TableItem[][] => {
  let newData: TableItem[][] = [];
  data.forEach(dataRow => {
    let row = [];
    dataRow.forEach(dataElement => {
      row.push(
        new TableItem({
          id: dataElement[key],
          data: dataElement[value],
        }));
    });
    newData.push(row);
  });
  return newData;
}

// TODO handle case when we id is not on first page - preselection
/** Set the data and update page */
export const selectPage = (page: number, model: TableModel, key: string, value: string) => {
  const data: Array<Array<any>> = getPage(page, model);
  model.data = prepareData(data, key, value);
  model.currentPage = page;
}

export const ensureSynteticIds = (items: Array<any>) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(items)
  ) {
    for (let item of items) {
      item.synteticId = uuid();
      RET_VAL.push(item);
    }
  }
  return RET_VAL;
}

