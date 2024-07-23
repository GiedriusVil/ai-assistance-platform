/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { _debugX } from 'client-utils';

@Component({
  selector: 'aiap-answer-comp',
  templateUrl: './answer.comp.html',
  styleUrls: ['./answer.comp.scss'],
})
export class AnswerComponent implements OnInit {

  static getClassname() {
    return 'AnswerComponent';
  }

  @Input() answer: any;

  @Output() onBtnClickEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void { }

  emitBtnClickEmitEvent(event: any) {
    _debugX(AnswerComponent.getClassname(), 'emitBtnClickEmitEvent', { event });
    this.onBtnClickEvent.emit(event);
  }

}
