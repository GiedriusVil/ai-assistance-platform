/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  EventEmitter,
  Output,
} from '@angular/core';


import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-assistant-policies-v1',
  templateUrl: './assistant-policies-v1.html',
  styleUrls: ['./assistant-policies-v1.scss'],
})
export class AssistantPoliciesV1 implements OnInit, OnDestroy, AfterViewInit {

  static getClassname() {
    return 'AssistantPoliciesV1';
  }

  @Input() tenant: any;
  @Input() application: any;
  @Input() assistant: any;

  @Output() onRemoveTenant = new EventEmitter<any>();
  @Output() onRemoveApplicationItem = new EventEmitter<any>();

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  ngAfterViewInit(): void {
    //
  }

  ngOnDestroy(): void {
    //
  }

  emitTenantRemoveEvent(event: any): void {
    _debugX(AssistantPoliciesV1.getClassname(), 'emitTenantRemoveEvent',
      {
        event,
      });

    this.onRemoveTenant.emit(event);
  }

  emitApplicationItemRemoveEvent(event: any): void {
    _debugX(AssistantPoliciesV1.getClassname(), 'emitApplicationItemRemoveEvent',
      {
        event,
      });

    this.onRemoveApplicationItem.emit(event);
  }
}
