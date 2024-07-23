/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const MODULE_ID = `aca-client-shared-utils-utils-common-utils`;

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { v4 as uuidv4 } from 'uuid';

import {
  _debugX,
} from '../loggers';

export function defaultQuery() {
  const RET_VAL = {
    filters: {},
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

export function handleSortByHeader(eventService: any, model: any, query: any, index: any, isModal: boolean = false) {
  const SORT_HEADER = ramda.path(['header', index], model);
  _debugX(MODULE_ID, 'handleSortByHeader', { SORT_HEADER });
  if (
    !SORT_HEADER.sorted
  ) {
    SORT_HEADER.sorted = true;
    SORT_HEADER.ascending = true;
    query.sort = {
      field: SORT_HEADER.field,
      direction: 'asc'
    }
  } else if (
    SORT_HEADER.sorted &&
    SORT_HEADER.ascending
  ) {
    SORT_HEADER.ascending = false;
    query.sort = {
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
  if (isModal) {
    eventService.modalFilterEmit(query);
  } else {
    eventService.filterEmit(query);
  }
}


export function handlePageChangeEvent(eventService: any, model: any, query: any, page: any, isModal: boolean = false) {
  _debugX(MODULE_ID, 'handlePageChangeEvent', {
    page: page,
    size: model.pageLength
  });
  query.pagination.page = page;
  query.pagination.size = model.pageLength;
  if (isModal) {
    eventService.modalFilterEmit(query);
  } else {
    eventService.filterEmit(query);
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


export const ensureSynteticIds = (items: Array<any>) => {
  const RET_VAL = [];
  if (
    !lodash.isEmpty(items)
  ) {
    for (let item of items) {
      item.synteticId = uuidv4();
      RET_VAL.push(item);
    }
  }
  return RET_VAL;
}
