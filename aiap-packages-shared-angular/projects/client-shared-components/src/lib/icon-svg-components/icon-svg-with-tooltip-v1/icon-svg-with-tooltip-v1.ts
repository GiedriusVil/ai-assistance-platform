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
  ElementRef,
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

import lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-icon-svg-with-tooltip-v1',
  templateUrl: './icon-svg-with-tooltip-v1.html',
  styleUrls: ['./icon-svg-with-tooltip-v1.scss'],
})
export class IconSvgWithTooltipV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'IconSvgWithTooltipV1';
  }

  @Input() tooltip;
  @Input() public src;

  _state = {
    src: null,
    tooltip: {
      value: null,
      delay: {
        open: 300,
        close: 100,
      }
    },
  }
  state = lodash.cloneDeep(this._state);

  constructor(
    private el: ElementRef,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    //
  }

  ngOnChanges(changes: SimpleChanges): void {
    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.src = this.src;
    STATE_NEW.tooltip.value = this.tooltip;
    _debugX(IconSvgWithTooltipV1.getClassName(), 'ngOnChanges',
      {
        changes: changes,
        STATE_NEW: STATE_NEW,
      });

    this.state = STATE_NEW;
  }
}
