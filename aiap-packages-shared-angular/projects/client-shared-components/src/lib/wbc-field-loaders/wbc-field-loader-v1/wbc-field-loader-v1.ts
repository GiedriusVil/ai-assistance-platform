/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-wbc-field-loader-v1',
  templateUrl: './wbc-field-loader-v1.html',
  styleUrls: ['./wbc-field-loader-v1.scss']
})
export class WbcFieldLoaderV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'WbcFieldLoaderV1';
  }

  @Input() context: any;
  @Output() contextChange = new EventEmitter<any>();

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(WbcFieldLoaderV1.getClassName(), 'ngOnChanges', {
      changes: changes,
      this_context: this.context,
      this_value: this.value,
    });
  }

  ngOnDestroy() { }

  handleContextChange(event: any) {
    _debugX(
      WbcFieldLoaderV1.getClassName(),
      'handleContextChange',
      {
        event: event,
        this_context: this.context,
        this_value: this.value,
      });

    let contextNew;
    if (
      event instanceof CustomEvent
    ) {
      contextNew = event?.detail;
    } else {
      contextNew = event;
    }
    this.contextChange.emit(contextNew);
  }

  handleValueChange(event: any) {
    _debugX(
      WbcFieldLoaderV1.getClassName(),
      'handleValueChange',
      {
        event: event,
        this_context: this.context,
        this_value: this.value,
      });
    let valueNew;
    if (
      event instanceof CustomEvent
    ) {
      valueNew = event?.detail;
    } else {
      valueNew = event;
    }
    this.valueChange.emit(valueNew);
  }

  url() {
    const RET_VAL = this.context?.wbc?.host + this.context?.wbc?.path;
    return RET_VAL;
  }

  loadingText() {
    return `Loading...`;
  }

  wbcLoadingError() {
    const RET_VAL = {
      type: 'error',
      title: 'WBC',
      message: `Waiting for application ${this.context?.wbc?.tag} to load from ${this.context?.wbc?.host}${this.context?.wbc?.path}!`,
      showClose: false,
    }
    return RET_VAL;
  }

}
