// /*
//   © Copyright IBM Corporation 2022. All Rights Reserved 
   
//   SPDX-License-Identifier: EPL-2.0
// */
// import * as ramda from 'ramda';

// import { _info } from './logger.utils';

// export function defaultQuery() {
//   const RET_VAL = {
//     filters: {},
//     sort: {
//       field: 'id',
//       direction: 'asc'
//     },
//     pagination: {
//       page: 1,
//       size: 10
//     }
//   };
//   return RET_VAL;
// }

// export function handleSortByHeader(eventService: any, model: any, query: any, index: any, isModal: boolean = false) {
//   const SORT_HEADER = ramda.path(['header', index], model);
//   _info('HANDLE_SORT_BY_HEADER', { SORT_HEADER: SORT_HEADER });
//   if (!SORT_HEADER.sorted) {
//     SORT_HEADER.sorted = true;
//     SORT_HEADER.ascending = true;
//     query.sort = {
//       field: SORT_HEADER.field,
//       direction: 'asc'
//     };
//   } else if (SORT_HEADER.sorted && SORT_HEADER.ascending) {
//     SORT_HEADER.ascending = false;
//     query.sort = {
//       field: SORT_HEADER.field,
//       direction: 'desc'
//     };
//   } else {
//     SORT_HEADER.sorted = false;
//   }
//   const HEADERS = ramda.path(['header'], model);
//   for (let header of HEADERS) {
//     if (header && SORT_HEADER && header.data !== SORT_HEADER.data) {
//       header.sorted = false;
//     }
//   }
//   if (isModal) {
//     eventService.modalFilterEmit(query);
//   } else {
//     eventService.filterEmit(query);
//   }
// }

// export function handlePageChangeEvent(eventService: any, model: any, query: any, page: any) {
//   _info('HANDLE_PAGE_CHANGE_EVENT', {
//     page: page,
//     size: model.pageLength
//   });

//   query.pagination.page = page;
//   query.pagination.size = model.pageLength;
//   eventService.filterEmit(query);
// }
