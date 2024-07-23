/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  EventEmitter,
  Output,
  SimpleChanges,
} from '@angular/core';


import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-application-policies-v1',
  templateUrl: './application-policies-v1.html',
  styleUrls: ['./application-policies-v1.scss'],
})
export class ApplicationPoliciesV1 implements OnInit, OnChanges {

  static getClassname() {
    return 'ApplicationPoliciesV1';
  }

  @Input() tenant: any;
  @Input() application: any;

  @Output() onRemoveTenant = new EventEmitter<any>();
  @Output() onRemoveApplicationItem = new EventEmitter<any>();

  constructor() {
    //
  }

  ngOnInit(): void {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    //
  }

  emitTenantRemoveEvent(event: any): void {
    _debugX(ApplicationPoliciesV1.getClassname(), 'emitTenantRemoveEvent',
      {
        event,
      });

    this.onRemoveTenant.emit(event);
  }

  emitApplicationItemRemoveEvent(event: any): void {
    _debugX(ApplicationPoliciesV1.getClassname(), 'emitApplicationItemRemoveEvent',
      {
        event,
      });

    this.onRemoveApplicationItem.emit(event);
  }
}
