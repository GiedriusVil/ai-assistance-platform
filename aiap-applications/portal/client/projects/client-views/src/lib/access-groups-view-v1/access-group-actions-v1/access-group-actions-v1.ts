/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import {
  BaseComponentV1,
} from 'client-shared-components';

@Component({
  selector: 'aiap-access-group-actions-v1',
  templateUrl: './access-group-actions-v1.html',
  styleUrls: ['./access-group-actions-v1.scss'],
})
export class AccessGroupActionsV1 extends BaseComponentV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'AccessGroupActionsV1';
  }

  @Input() actions: any[] = [];
  @Input() height = 100;

  @Output() onSelectAll = new EventEmitter();

  allChecked = false;

  constructor() {
    super()
  }

  ngOnInit(): void {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(AccessGroupActionsV1.getClassName(), 'ngOnChanges',
      {
        changes: changes,
        this_actions: this.actions,
      });

    if (
      !changes?.actions?.currentValue
    ) {
      this.allChecked = false;
    }
  }

  ngOnDestroy(): void {
    //
  }

  onChange(event: any): void {
    _debugX(AccessGroupActionsV1.getClassName(), 'onChange',
      {
        event: event,
        this_actions: this.actions,
      });
  }

  selectAll(event: any): void {
    const CHECKED = event?.checked;
    this.allChecked = CHECKED;
    this.onSelectAll.emit(CHECKED);
  }
}
