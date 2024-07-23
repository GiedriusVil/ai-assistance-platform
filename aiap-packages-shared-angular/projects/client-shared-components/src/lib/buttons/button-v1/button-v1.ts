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
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-button-v1',
  templateUrl: './button-v1.html',
  styleUrls: ['./button-v1.scss'],
})
export class ButtonV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'ButtonV1';
  }

  @Input() text;
  @Input() tooltip;
  @Input() type = 'primary';
  @Input() icon;
  @Input() disabled = false;
  @Input() skeleton = false;
  @Input() iconOnly = false;

  @Input() placement = 'top';
  @Input() size;

  @Output() onClick = new EventEmitter<any>();


  _state = {
    text: null,
    tooltip: {
      value: null,
      delay: {
        open: 300,
        close: 100,
      }
    },
    disabled: false,
    skeleton: false,
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
    STATE_NEW.skeleton = this.skeleton;
    // STATE_NEW.text = this.translateService.instant(this.text);
    // STATE_NEW.tooltip = this.translateService.instant(this.tooltip);
    _debugX(ButtonV1.getClassName(), 'ngOnInit',
      {
        STATE_NEW,
      });

    this.state = STATE_NEW;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const STATE_NEW = lodash.cloneDeep(this.state);
    STATE_NEW.text = this.text;
    STATE_NEW.tooltip.value = this.tooltip;
    STATE_NEW.disabled = this.disabled;
    STATE_NEW.skeleton = this.skeleton;
    _debugX(ButtonV1.getClassName(), 'ngOnChanges',
      {
        changes: changes,
        STATE_NEW: STATE_NEW,
      });

    this.state = STATE_NEW;
  }

  handleClickEvent(event: any) {
    this.onClick.emit(event);
  }

}
