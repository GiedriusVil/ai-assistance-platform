/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  _debugX,
} from 'client-shared-utils';

import lodash from 'lodash';

@Component({
  selector: 'aiap-overflow-menu-option-v1',
  templateUrl: './overflow-menu-option-v1.html',
  styleUrls: ['./overflow-menu-option-v1.scss'],
})
export class OverflowMenuOptionV1 implements OnInit {

  static getClassName() {
    return 'OverflowMenuOptionV1';
  }

  @Input() text;
  @Input() tooltip;
  @Input() disabled;

  @Output() onClick = new EventEmitter<any>();

  _state = {
    text: null,
    tooltip: {
      value: null,
      delay: {
        open: 500,
        close: 100,
      }
    },
    disabled: false,
  }
  state = lodash.cloneDeep(this._state);

  constructor() {
    //
  }

  ngOnInit(): void {
    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.text = this.text;
    STATE_NEW.tooltip.value = this.tooltip;
    STATE_NEW.disabled = this.disabled;
    // STATE_NEW.text = this.translateService.instant(this.text);
    // STATE_NEW.tooltip = this.translateService.instant(this.tooltip);
    _debugX(OverflowMenuOptionV1.getClassName(), 'ngOnInit',
      {
        STATE_NEW,
      });

    this.state = STATE_NEW;
  }

  handleEventClick(event: any) {
    _debugX(OverflowMenuOptionV1.getClassName(), 'handleEventClick',
      {
        event,
      });

    this.onClick.emit(event);
  }

}
