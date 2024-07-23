/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, EventEmitter, Input, Output, } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  _debugX,
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aca-engagement-soe-tab',
  templateUrl: './engagement-soe-tab.html',
  styleUrls: ['./engagement-soe-tab.scss']
})
export class EngagementSoeTab implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'EngagementSoeTab';
  }

  @Input() value;
  @Output() valueChange = new EventEmitter<any>();

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  constructor() { }

  ngOnInit() {
    this.jsonEditorOptions.name = 'aca-soe (Configuration)';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.modes = ['code'];
    this.jsonEditorOptions.mode = 'code';
  }

  ngAfterViewInit(): void { }

  ngOnDestroy() { }

  ngOnChanges() { }

  handleChangeEvent(event: any) {
    try {
      if (
        event?.type === 'change'
      ) {
        const JSON_EDITOR_VALUE = this.jsonEditor.get()
        _debugX(EngagementSoeTab.getClassName(), 'handleChangeEvent', { event, JSON_EDITOR_VALUE });
        this.valueChange.emit(JSON_EDITOR_VALUE);
      }
    } catch (error) {
      _errorX(EngagementSoeTab.getClassName(), 'handleChangeEvent', { event, error });
    }
  }

  isValid(): boolean {
    try {
      const RET_VAL: boolean = this.jsonEditor.isValidJson();
      return RET_VAL;
    } catch (error) {
      _errorX(EngagementSoeTab.getClassName(), 'getValue', { error });
      throw error;
    }
  }

  getValue() {
    let retVal;
    try {
      const RET_VAL = this.jsonEditor.get();
      return RET_VAL;
    } catch (error) {
      _errorX(EngagementSoeTab.getClassName(), 'getValue', { error });
      throw error;
    }
  }

}
