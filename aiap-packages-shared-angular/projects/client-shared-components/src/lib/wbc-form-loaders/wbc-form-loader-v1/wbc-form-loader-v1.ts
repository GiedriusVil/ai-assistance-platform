/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, OnChanges, SimpleChanges, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-wbc-form-loader-v1',
  templateUrl: './wbc-form-loader-v1.html',
  styleUrls: ['./wbc-form-loader-v1.scss']
})
export class WbcFormLoaderV1 implements OnInit, OnDestroy, OnChanges {

  static getClassName() {
    return 'WbcFormLoaderV1';
  }

  @Input() context: any;
  @Output() contextChange = new EventEmitter<any>();

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  @ViewChild('lazyElementContainer', { read: ViewContainerRef }) lazyElementContainer: ViewContainerRef;
  @ViewChild('lazyElementTemplate', { read: TemplateRef }) lazyElementTemplate: TemplateRef<any>;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    _debugX(WbcFormLoaderV1.getClassName(), 'ngOnChanges', {
      changes: changes,
      this_context: this.context,
      this_value: this.value,
    });
  }

  ngOnDestroy() { }

  resetView() {
    _debugX(WbcFormLoaderV1.getClassName(), 'resetView', {
      this_context: this.context,
      this_value: this.value,
    });
    this.lazyElementContainer.clear();
    this.lazyElementContainer.createEmbeddedView(this.lazyElementTemplate);
  }

  handleContextChange(event: any) {
    _debugX(
      WbcFormLoaderV1.getClassName(),
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
      WbcFormLoaderV1.getClassName(),
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
      message: `Unable to load ${this.context?.wbc?.tag} from ${this.context?.wbc?.host}${this.context?.wbc?.path}!`,
      showClose: false,
    }
    return RET_VAL;
  }

}
