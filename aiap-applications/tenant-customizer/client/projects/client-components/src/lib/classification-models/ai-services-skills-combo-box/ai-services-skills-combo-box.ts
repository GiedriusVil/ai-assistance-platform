/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

import * as lodash from 'lodash';

import {
  _debugX,
  _errorX
} from 'client-shared-utils';

@Component({
  selector: 'aca-ai-services-skills-combo-box',
  templateUrl: './ai-services-skills-combo-box.html',
  styleUrls: ['./ai-services-skills-combo-box.scss'],
})

export class AiServicesSkillsComboBox implements OnInit, OnDestroy {

  static getClassName() {
    return 'AiServicesSkillsComboBox';
  };

  private _destroyed$: Subject<void> = new Subject();

  @Input() value: Array<any>;
  @Output() valuesChanged = new EventEmitter<Array<any> | any>();

  @Input() label: string;
  @Input() placeholder: string;
  @Input() type: string;

  constructor() { }

  ngOnInit() { }

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  handleSelectedEvent(event: any) {
    if (!lodash.isEmpty(event)) {
      this.valuesChanged.emit(event);
    }

    _debugX(AiServicesSkillsComboBox.getClassName(), 'handleSelectedEvent', {
      event,
      this_value: this.value,
    });
  }
}
