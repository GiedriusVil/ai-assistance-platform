/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  _debugX,
  _errorX
} from 'client-utils';

@Component({
  selector: 'aca-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss']
})
export class AcaJsonEditor implements OnInit {

  static getClassName() {
    return 'AcaJsonEditor';
  }
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();
  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();
  jsonValue: any;
  constructor() { }

  ngOnInit() {
    this.jsonEditorOptions.name = 'Configuration';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.modes = ['code', 'text', 'view'];
    this.jsonEditorOptions.mode = 'code';
    this.jsonValue = lodash.cloneDeep(this.value);
  }

  emitEditorValue(event) {
    if (event.type !== 'change' && this.jsonEditor.isValidJson()) {
      this.valueChange.emit(event);
    }
  }
}
