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
import { _debugX } from 'client-shared-utils';

import lodash from 'lodash';

@Component({
  selector: 'aiap-inline-loader-v1',
  templateUrl: './inline-loader-v1.html',
  styleUrls: ['./inline-loader-v1.scss'],
})
export class InlineLoaderV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'InlineLoaderV1';
  }

  @Input() status: any;
  @Input() textloading: any;

  _state = {
    status: null,
    textloading: null,
  };
  state = lodash.cloneDeep(this._state)

  constructor() {
    //
  }

  ngOnInit(): void {
    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.status = this.status;
    STATE_NEW.textloading = this.textloading;
    this.state = STATE_NEW;
    _debugX(InlineLoaderV1.getClassName(), 'ngOnInit',
      {
        STATE_NEW,
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.status = this.status;
    STATE_NEW.textloading = this.textloading;
    this.state = STATE_NEW;
    _debugX(InlineLoaderV1.getClassName(), 'ngOnChanges',
      {
        STATE_NEW,
      });
  }

}
