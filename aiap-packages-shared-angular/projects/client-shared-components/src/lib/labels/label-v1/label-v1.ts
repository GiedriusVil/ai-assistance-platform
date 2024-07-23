/*
  © Copyright IBM Corporation 2022. All Rights Reserved

  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import lodash from 'lodash';

import {
  _debugX
} from 'client-shared-utils';

@Component({
  selector: 'aiap-label-v1',
  templateUrl: './label-v1.html',
  styleUrls: ['./label-v1.scss'],
})
export class LabelV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'LabelV1';
  }

  @Input() label: any;
  @Input() labelHelp: any;

  _state = {
    label: null,
    labelHelp: null,
  };
  state = lodash.cloneDeep(this._state)

  constructor() {
    //
  }

  ngOnInit(): void {
    const STATE_NEW = lodash.cloneDeep(this.state);


    STATE_NEW.label = this.label;
    STATE_NEW.labelHelp = this.labelHelp;

    this.state = STATE_NEW;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const STATE_NEW = lodash.cloneDeep(this.state);

    STATE_NEW.label = this.label;
    STATE_NEW.labelHelp = this.labelHelp;

    this.state = STATE_NEW;
  }

}
