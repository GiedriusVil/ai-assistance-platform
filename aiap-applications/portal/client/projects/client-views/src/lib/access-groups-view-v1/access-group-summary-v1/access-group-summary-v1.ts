/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';


import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-access-group-summary-v1',
  templateUrl: './access-group-summary-v1.html',
  styleUrls: ['./access-group-summary-v1.scss'],
})
export class AccessGroupSummaryV1 implements OnInit, OnDestroy {

  static getClassname() {
    return 'AccessGroupSummaryV1';
  }

  @Input() accessGroup: any;

  @Output() onRemoveTenantPolicyItem = new EventEmitter<any>();
  @Output() onRemovePlatformPolicyItem = new EventEmitter<any>();

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy(): void {
    //
  }

  emitRemovePlatformPolicyItemEvent(event: any): void {
    _debugX(AccessGroupSummaryV1.getClassname(), 'emitRemovePlatformPolicyItemEvent',
      {
        event,
      });

    this.onRemovePlatformPolicyItem.emit(event);
  }

  emitRemoveTenantPolicyItemEvent(event: any): void {
    _debugX(AccessGroupSummaryV1.getClassname(), 'emitRemoveTenantPolicyItemEvent',
      {
        event,
      });

    this.onRemoveTenantPolicyItem.emit(event);
  }

}
