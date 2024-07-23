/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit } from '@angular/core';

import {
  BaseModalV1,
} from 'client-shared-views';

@Component({
  selector: 'aiap-rule-message-instruction-modal-v1',
  templateUrl: './rule-message-instruction-modal-v1.html',
  styleUrls: ['./rule-message-instruction-modal-v1.scss']
})
export class RuleMessageInstructionModalV1 extends BaseModalV1 implements OnInit {

  static getClassName() {
    return 'RuleMessageInstructionModalV1';
  }

  @Input() step: number = 0;

  constructor() {
    super();
  }

  ngOnInit() { }

  show(event: any) {
    this.superShow();
  }

}
