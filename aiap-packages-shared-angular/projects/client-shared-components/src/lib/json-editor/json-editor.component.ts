/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import * as ramda from 'ramda';
import * as lodash from 'lodash';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value.currentValue.translated) {
      this.removeObjectAttribute(changes.value.currentValue, 'translated');
      this.updateEditorValue();
    }
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'Configuration';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.modes = ['code', 'text', 'view'];
    this.jsonEditorOptions.mode = 'code';
    this.updateEditorValue();
  }

  emitEditorValue(event) {
    if (event.type !== 'change' && this.jsonEditor.isValidJson()) {
      this.valueChange.emit(event);
    }
  }

  updateEditorValue() {
    this.jsonValue = lodash.cloneDeep(this.value);
  }

  removeObjectAttribute(item, attribute) {
    delete item[attribute];
    return item;
  }
}
