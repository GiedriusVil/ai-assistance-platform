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

@Component({
  selector: 'aiap-table-v1-toolbar-search-v1',
  templateUrl: './table-v1-toolbar-search-v1.html',
  styleUrls: ['./table-v1-toolbar-search-v1.scss'],
})
export class TableV1ToolbarSearchV1 implements OnInit {

  static getClassName() {
    return 'TableV1ToolbarSearchV1';
  }

  @Input() search;
  @Input() placeholder: string = '';

  @Output() onSearchChange = new EventEmitter<any>();
  @Output() onSearchClear = new EventEmitter<any>();

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  handleEventSearchChange(event: any) {
    _debugX(TableV1ToolbarSearchV1.getClassName(), 'handleSearchChangeEvent',
      {
        event,
      });
    this.onSearchChange.emit(event);
  }

  handleEventSearchClear(event: any) {
    _debugX(TableV1ToolbarSearchV1.getClassName(), 'handleEventSearchClear',
      {
        event,
      });
    this.onSearchClear.emit(event);
  }

}
