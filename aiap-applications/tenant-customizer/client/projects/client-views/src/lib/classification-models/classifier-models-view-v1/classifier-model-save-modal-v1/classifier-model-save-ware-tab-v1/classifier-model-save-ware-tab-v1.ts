/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  Input,
} from '@angular/core';

import { Subject } from 'rxjs/internal/Subject';

import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';

import {
  _errorX,
} from 'client-shared-utils';


@Component({
  selector: 'aca-classifier-model-save-ware-tab',
  templateUrl: './classifier-model-save-ware-tab-v1.html',
  styleUrls: ['./classifier-model-save-ware-tab-v1.scss'],
})
export class ClassifierModelSaveWareTab implements OnInit, OnDestroy {

  static getClassName() {
    return 'ClassifierModelSaveWareTab';
  }

  private _destroyed$: Subject<void> = new Subject();

  @ViewChild(JsonEditorComponent, { static: false }) jsonEditor: JsonEditorComponent;
  jsonEditorOptions: JsonEditorOptions = new JsonEditorOptions();

  @Input() value;

  constructor() {
    //
  }

  ngOnInit() {
    this.jsonEditorOptions.name = 'Configuration';
    this.jsonEditorOptions.statusBar = true;
    this.jsonEditorOptions.modes = ['code'];
    this.jsonEditorOptions.mode = 'code';
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  getValue() {
    try {
      const RET_VAL = this.jsonEditor.get();
      return RET_VAL;
    } catch (error) {
      _errorX(ClassifierModelSaveWareTab.getClassName(), 'isValid',
        {
          error,
        });

      throw error;
    }
  }

  isValid() {
    try {
      let retVal = false;
      if (
        this.jsonEditor
      ) {
        retVal = this.jsonEditor.isValidJson();
      }
      return retVal;
    } catch (error) {
      _errorX(ClassifierModelSaveWareTab.getClassName(), 'isValid',
        {
          error,
        });

      throw error;
    }
  }


}
