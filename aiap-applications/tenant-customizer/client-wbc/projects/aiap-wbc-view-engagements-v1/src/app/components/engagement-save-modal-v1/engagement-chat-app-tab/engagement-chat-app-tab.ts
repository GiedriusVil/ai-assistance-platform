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

import {
  CHAT_APP_ENGAGEMENT_SCHEMA,
} from 'client-utils';

@Component({
  selector: 'aca-engagement-chat-app-tab',
  templateUrl: './engagement-chat-app-tab.html',
  styleUrls: ['./engagement-chat-app-tab.scss']
})

export class EngagementChatAppTab implements OnInit, OnDestroy, AfterViewInit {

  static getClassName() {
    return 'EngagementChatAppTab';
  }

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  constructor() { }

  ngOnInit() {
    this.jsonEditorOptions.name = 'aca-chat-app (Configuration)';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.modes = ['code'];
    this.jsonEditorOptions.mode = 'code';
    this.jsonEditorOptions.schema = {
      ...CHAT_APP_ENGAGEMENT_SCHEMA
    }
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
        _debugX(EngagementChatAppTab.getClassName(), 'handleChangeEvent', { event, JSON_EDITOR_VALUE });
        this.valueChange.emit(JSON_EDITOR_VALUE);
      }
    } catch (error) {
      _errorX(EngagementChatAppTab.getClassName(), 'handleChangeEvent', { event, error });
    }
  }

  public isValid(): boolean {
    try {
      const EDITOR = this.jsonEditor.getEditor();
      const SCHEMA_ERRORS = EDITOR.validateSchema?.errors;
      const RET_VAL: boolean = this.jsonEditor.isValidJson() && lodash.isEmpty(SCHEMA_ERRORS);
      return RET_VAL;
    } catch (error) {
      _errorX(EngagementChatAppTab.getClassName(), 'getValue', { error });
      throw error;
    }
  }

  public getValue() {
    let retVal;
    try {
      const RET_VAL = this.jsonEditor.get();
      return RET_VAL;
    } catch (error) {
      _errorX(EngagementChatAppTab.getClassName(), 'getValue', { error });
      throw error;
    }
  }

}
