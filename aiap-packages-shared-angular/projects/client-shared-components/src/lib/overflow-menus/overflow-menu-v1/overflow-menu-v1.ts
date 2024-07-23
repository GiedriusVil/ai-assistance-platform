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
  selector: 'aiap-overflow-menu-v1',
  templateUrl: './overflow-menu-v1.html',
  styleUrls: ['./overflow-menu-v1.scss'],
})
export class OverflowMenuV1 implements OnInit {

  static getClassName() {
    return 'OverflowMenuV1';
  }

  @Input() tooltip;

  @Output() onClick = new EventEmitter<any>();

  _state = {
    flip: true,
    tooltip: {
      value: null,
      delay: {
        open: 300,
        close: 100,
      }
    },
  }
  state = lodash.cloneDeep(this._state);

  constructor() {
    //
  }

  ngOnInit(): void {
    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.tooltip.value = this.tooltip;
    // STATE_NEW.text = this.translateService.instant(this.text);
    // STATE_NEW.tooltip = this.translateService.instant(this.tooltip);
    _debugX(OverflowMenuV1.getClassName(), 'ngOnInit',
      {
        STATE_NEW,
      });

    this.state = STATE_NEW;
  }

  handleEventClick(event: any) {
    _debugX(OverflowMenuV1.getClassName(), 'handleEventClick',
      {
        event,
      });

    this.onClick.emit(event);
  }

}
