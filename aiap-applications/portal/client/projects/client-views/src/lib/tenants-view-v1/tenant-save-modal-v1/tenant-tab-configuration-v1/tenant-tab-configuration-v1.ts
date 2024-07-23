/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  OnInit,
  Component,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  OnChanges,
} from '@angular/core';

import {
  JsonEditorOptions,
  JsonEditorComponent,
} from 'ang-jsoneditor';

import * as lodash from 'lodash';

import {
  TENANT_CONFIGURATION_SCHEMA,
} from 'client-utils';

import {
  _errorX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-tenant-tab-configuration-v1',
  templateUrl: './tenant-tab-configuration-v1.html',
  styleUrls: ['./tenant-tab-configuration-v1.scss'],
})
export class TenantTabConfigurationV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'TenantTabConfigurationV1';
  }

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;

  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  constructor() {
    //
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'tenant-configuration';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.modes = ['code'];
    this.jsonEditorOptions.mode = 'code';
    this.jsonEditorOptions.schema = {
      ...TENANT_CONFIGURATION_SCHEMA
    }
  }

  ngOnChanges() {
    //
  }

  public isValid(): boolean {
    try {
      let retVal = false;
      if (
        this.jsonEditor
      ) {
        const EDITOR = this.jsonEditor.getEditor();
        const SCHEMA_ERRORS = EDITOR.validateSchema?.errors;
        retVal = this.jsonEditor.isValidJson() && lodash.isEmpty(SCHEMA_ERRORS);
        return retVal;
      }
    } catch (error) {
      _errorX(TenantTabConfigurationV1.getClassName(), 'getValue',
        {
          error,
        });

      throw error;
    }
  }

  public getValue() {
    try {
      const RET_VAL = this.jsonEditor.get();
      return RET_VAL;
    } catch (error) {
      _errorX(TenantTabConfigurationV1.getClassName(), 'getValue',
        {
          error,
        });

      throw error;
    }
  }

}
