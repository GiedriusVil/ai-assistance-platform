/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

import * as lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';


@Component({
  selector: 'aca-classifier-model-save-ai-service-card',
  templateUrl: './classifier-model-save-ai-service-card-v1.html',
  styleUrls: ['./classifier-model-save-ai-service-card-v1.scss'],
})
export class ClassifierModelSaveAiServiceCard implements OnInit, OnDestroy {

  static getClassName() {
    return 'ClassifierModelSaveAiServiceCard';
  }

  private _destroyed$: Subject<void> = new Subject();

  @Input() value;
  @Output() valueChange: any = new EventEmitter<any>();

  @Output() onAiServiceRemove: any = new EventEmitter<any>();

  constructor() {
    //
  }

  ngOnInit() {
    //
  }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  isInvalidRegexPattern() {
    let retVal = true;
    try {
      if (
        lodash.isEmpty(this.value?.value?.regex)
      ) {
        retVal = false;
      } else {
        new RegExp(this.value?.value?.regex);
        retVal = false;
      }
    } catch (error) {
      //
    }
    return retVal;
  }

  handleRemoveAiServiceClickEvent(event: any) {
    _debugX(ClassifierModelSaveAiServiceCard.getClassName(), 'handleAddAiServicesEvent',
      {
        event,
      });

    this.onAiServiceRemove.emit(this.value);
  }

  handleAddNewValue() {
    const NEW_VALUE = {
      language: undefined,
      value: undefined
    };
    if (!this.value.value.displayNameValues) {
      this.value.value.displayNameValues = [];
    }
    this.value.value.displayNameValues.push(NEW_VALUE);
    _debugX(ClassifierModelSaveAiServiceCard.getClassName(), 'handleAddNewDisplayNameValue',
      {
        displayNameValues: lodash.cloneDeep(this.value.displayNameValues),
      });
  }

  handleValueRemoveEvent(i) {
    this.value.value.displayNameValues.splice(i, 1);
    if (
      lodash.isEmpty(this.value.value.displayNameValues)
    ) {
      delete this.value.value.displayNameValues;
    }
  }

}
