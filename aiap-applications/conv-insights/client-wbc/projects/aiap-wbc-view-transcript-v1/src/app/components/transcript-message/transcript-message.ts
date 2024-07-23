/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

import { SessionServiceV1 } from 'client-shared-services';

@Component({
  selector: 'aca-transcript-message',
  templateUrl: './transcript-message.html',
  styleUrls: ['./transcript-message.scss'],
})
export class TranscriptMessage implements OnInit {

  static getClassName() {
    return 'TranscriptMessage';
  }

  MESSAGE_TYPE = {
    NATIVE: 'native',
    WBC: 'wbc',
  };

  @Input() value: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  messageType: string;

  constructor(
    private sessionService: SessionServiceV1,
  ) { }

  ngOnInit(): void {
    const TRANSCRIPT_VIEW = this.sessionService.getSession()?.application?.configuration?.views?.find(view => view.component === 'TranscriptView');

    this.messageType = TRANSCRIPT_VIEW?.configs?.message?.type || this.MESSAGE_TYPE.NATIVE;
  }

}
