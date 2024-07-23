/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import lodash from 'lodash';

import {
  TranslateHelperServiceV1,
} from 'client-shared-services';

@Component({
  selector: 'aiap-table-v1-pagination-v1',
  templateUrl: './table-v1-pagination-v1.html',
  styleUrls: ['./table-v1-pagination-v1.scss'],
})
export class TableV1PaginationV1 implements OnInit {

  static getClassName() {
    return 'TableV1PaginationV1';
  }

  @Input() model: any;
  @Input() options: any;
  @Input() showPageInput = true;
  @Input() isVisiblePageInput: any;

  @Output() onPageSelect = new EventEmitter<any>();

  translations = {
    ITEMS_PER_PAGE: 'Items per page:',
    TOTAL_ITEMS: '{{start}}-{{end}} of {{total}} items',
    TOTAL_ITEM: '{{start}}-{{end}} of {{total}} item',
  	OF_LAST_PAGES: 'of {{last}} pages',
  	OF_LAST_PAGE: 'of {{last}} page'
  }

  constructor(private translateHelperServiceV1: TranslateHelperServiceV1,) {
    //
  }

  ngOnInit(): void {
    //
    this.translations.ITEMS_PER_PAGE = this.translateHelperServiceV1.instant('client_shared_components.table-v1-pagination.itemsPerPage');
    this.translations.TOTAL_ITEMS = this.translateHelperServiceV1.instant('client_shared_components.table-v1-pagination.totalItems');
    this.translations.TOTAL_ITEM = this.translateHelperServiceV1.instant('client_shared_components.table-v1-pagination.totalItem');
    this.translations.OF_LAST_PAGES = this.translateHelperServiceV1.instant('client_shared_components.table-v1-pagination.ofLastPages');
    this.translations.OF_LAST_PAGE = this.translateHelperServiceV1.instant('client_shared_components.table-v1-pagination.ofLastPage');
  }

  handleEventPageSelect(event: any) {
    _debugX(TableV1PaginationV1.getClassName(), 'handleEventPageSelect',
      {
        event,
      });

    this.onPageSelect.emit(event);
  }

}
