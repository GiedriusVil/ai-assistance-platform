/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import {
  EventsServiceV1,
} from 'client-shared-services';

import {
  AccessGroupsServiceV1,
} from 'client-services';

import {
  BaseComponentV1,
} from 'client-shared-components';

@Component({
  selector: 'aiap-access-group-policy-general-v1',
  templateUrl: './access-group-policy-general-v1.html',
  styleUrls: ['./access-group-policy-general-v1.scss']
})
export class AccessGroupPolicyGeneralV1 extends BaseComponentV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'AccessGroupPolicyGeneralV1';
  }

  @Input() accessGroup;
  @Output() accessGroupChange = new EventEmitter<any>();

  constructor(
    private eventsService: EventsServiceV1,
    private accessGroupsService: AccessGroupsServiceV1,
  ) {
    super();
  }

  ngOnInit(): void {
    this.superNgOnInit(this.eventsService);
  }

  ngOnDestroy(): void {
    this.superNgOnDestroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //
  }


}
