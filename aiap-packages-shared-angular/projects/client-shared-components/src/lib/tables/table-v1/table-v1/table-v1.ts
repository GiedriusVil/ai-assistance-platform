/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-table-v1',
  templateUrl: './table-v1.html',
  styleUrls: ['./table-v1.scss'],
})
export class TableV1 implements OnInit {

  static getClassName() {
    return 'TableV1';
  }

  @Input() model;

  @Input() size = 'md';
  @Input() striped = true;
  @Input() skeleton = false;
  @Input() showSelectionColumn = true;
  @Input() sortable = true;
  @Input() stickyHeader = false;
  @Input() isDataGrid;
  @Input() enableSingleSelect = false;

  @Output() onAllSelect = new EventEmitter<any>();
  @Output() onAllDeselect = new EventEmitter<any>();

  @Output() onRowSelect = new EventEmitter<any>();
  @Output() onRowDeselect = new EventEmitter<any>();
  @Output() onRowClick = new EventEmitter<any>();

  @Output() onSort = new EventEmitter<any>();

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  handleEventAllSelect(event: any) {
    _debugX(TableV1.getClassName(), 'handleEventAllSelect',
      {
        event,
      });

    this.onAllSelect.emit(event);
  }

  handleEventAllDeselect(event: any) {
    _debugX(TableV1.getClassName(), 'handleEventAllDeselect',
      {
        event,
      });

    this.onAllDeselect.emit(event);
  }

  handleEventRowSelect(event: any) {
    _debugX(TableV1.getClassName(), 'handleEventRowSelect',
      {
        event,
      });

    this.onRowSelect.emit(event);
  }

  handleEventRowDeselect(event: any) {
    _debugX(TableV1.getClassName(), 'handleEventRowDeselect',
      {
        event,
      });

    this.onRowDeselect.emit(event);
  }

  handleEventRowClick(event: any) {
    _debugX(TableV1.getClassName(), 'handleEventRowClick',
      {
        event,
      });

    this.onRowClick.emit(event);
  }

  handleEventSort(event: any) {
    _debugX(TableV1.getClassName(), 'handleEventSort',
      {
        event,
      });

    this.onSort.emit(event);
  }

}
