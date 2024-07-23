/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'aiap-rule-instruction-modal-v1',
  templateUrl: './rule-instruction-modal-v1.html',
  styleUrls: ['./rule-instruction-modal-v1.scss']
})
export class RuleInstructionModalV1 implements OnInit {

  static getClassName() {
    return 'RuleInstructionModalV1';
  }

  @Input() step: number = 0;

  isOpen = false;

  constructor() { }

  ngOnInit() { }

  show(event: any) {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

}
