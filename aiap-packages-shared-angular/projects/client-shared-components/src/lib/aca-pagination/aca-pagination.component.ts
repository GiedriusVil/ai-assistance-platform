/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Input, EventEmitter, Output, ViewChild, Component, OnInit, SimpleChanges, ChangeDetectionStrategy, OnChanges, OnDestroy } from '@angular/core';
import { Pagination } from 'carbon-components';

@Component({
  selector: 'aca-pagination',
  templateUrl: './aca-pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcaPaginationComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('paginationComponent', { static: true }) datapagination;

  @Input() numberOfPagesRetrieved: number;
  @Input() itemsPerPage: number = 10;
  @Input() selectedPage: number = 1;
  @Output() selectedPageChanged = new EventEmitter<{selectedPage: number, itemsPerPage?: number}>();

  paginationElement;

  pagination: any = {
    visible: true,
    currentPage: 1,
    totalItems: 0,
    itemsPerPageList: [10, 20, 50, 100],
    pagesList: [1],
    totalPages: 1
  };

  constructor() { }

  ngOnInit(): void {
    this.paginationElement = Pagination.create(this.datapagination.nativeElement);

    this.datapagination.nativeElement.addEventListener('itemsPerPage', event => {
      this.itemsPerPage = +event.detail.value;
      this.selectedPage = 1;
      this.selectedPageChanged.emit({selectedPage: this.selectedPage, itemsPerPage: this.itemsPerPage})
    });

    this.datapagination.nativeElement.addEventListener('pageNumber', event => {
      this.selectedPage = +event.detail.value;
      this.selectedPageChanged.emit({selectedPage: this.selectedPage})
    });

    this.datapagination.nativeElement.addEventListener('pageChange', event => {
      if (event.detail.direction === 'forward' && this.selectedPage < this.pagination.pagesList.length) {
        this.selectedPage += 1;      
      } else if (event.detail.direction === 'backward' && this.selectedPage > 1) {
        this.selectedPage -= 1;
      }
      this.selectedPageChanged.emit({selectedPage: this.selectedPage})
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['numberOfPagesRetrieved']) {
      this.numberOfPagesRetrieved = changes.numberOfPagesRetrieved.currentValue;
      this.refreshPagination(this.numberOfPagesRetrieved);
    }
  }

  itemsPerPageCounter() {
    const offset = (this.selectedPage - 1) * this.itemsPerPage;
    const from = offset + 1;
    let to = offset + this.itemsPerPage;
    to = to < this.pagination.totalItems ? to : this.pagination.totalItems;
    this.refreshPagination(this.numberOfPagesRetrieved);
    return `${from}-${to}`;
  }

  setItemsPerPage(index: any) {
    const i = this.pagination.itemsPerPageList.indexOf(this.itemsPerPage);
    return index === i ? true: null
  }

  setPage(index: any) {
    const i = this.pagination.pagesList.indexOf(this.selectedPage);
    return index === i ? true: null
  }

  refreshPagination(pages: number) {
    this.pagination.totalItems = pages ? pages : 1;
    this.pagination.totalPages = pages ? Math.ceil(pages / this.itemsPerPage) : 1;
    this.pagination.pagesList = [];
    for (let i = 0; i < this.pagination.totalPages; i++) { 
      this.pagination.pagesList.push(i + 1);
    }
  }

  ngOnDestroy() {
    this.datapagination.nativeElement.removeEventListener('itemsPerPage', () => {});
    this.datapagination.nativeElement.removeEventListener('pageNumber', () => {});
    this.datapagination.nativeElement.removeEventListener('pageChange', () => {});
  }

}
