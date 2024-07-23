/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as ramda from 'ramda';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aca-wbc-attachment',
  templateUrl: './wbc-attachment.html',
  styleUrls: ['./wbc-attachment.scss'],
})
export class WbcAttachment implements OnInit, AfterViewInit, OnDestroy {

  static getClassName() {
    return 'WbcAttachment';
  }

  @Input() message: any;

  @Output() onUserAction = new EventEmitter<any>();

  state: any = {
    component: undefined,
    host: undefined,
    path: undefined,
    errorMessage: undefined,
  }

  constructor() { }

  ngOnInit(): void {
    this.state.component = ramda.path(['attachment', 'type'], this.message);
    this.state.host = ramda.path(['attachment', 'host'], this.message);
    this.state.path = ramda.path(['attachment', 'path'], this.message);
    this.state.errorMessage = ramda.pathOr('Error', ['attachment', 'attributes', 1, 'errorMessage'], this.message);
    _debugX(WbcAttachment.getClassName(), `ngOnInit`, {
      this_state: this.state,
      this_message: this.message
    });
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    _debugX(WbcAttachment.getClassName(), `ngAfterViewInit`, {
      this_state: this.state,
      this_message: this.message
    });
  }

  url() {
    return this.state.host + this.state.path;
  }

}
