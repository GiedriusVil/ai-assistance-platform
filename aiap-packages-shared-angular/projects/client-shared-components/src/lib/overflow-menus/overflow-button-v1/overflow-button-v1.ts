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
  TemplateRef,
  ViewChild,
  ElementRef,
} from '@angular/core';

import lodash from 'lodash';

import {
  _debugX,
} from 'client-shared-utils';

@Component({
  selector: 'aiap-overflow-button-v1',
  templateUrl: './overflow-button-v1.html',
  styleUrls: ['./overflow-button-v1.scss'],
})
export class OverflowButtonV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'OverflowButtonV1';
  }

  @Input() text;
  @Input() tooltip;
  @Input() type = 'primary';
  @Input() icon;
  @Input() disabled = false;
  @Input() skeleton = false;
  @Input() iconOnly = false;

  @Input() offset;
  @Input() overflowMenu: TemplateRef<any>;
  @Input() customPane = false;

  @Input() placement = 'top';
  @Input() size;

  @Output() onClick = new EventEmitter<any>();

  @ViewChild('overflowButtonV1') public overflowButtonV1: ElementRef;

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
    offset: undefined,
    overflowMenu: undefined,
    customPane: false,
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
    STATE_NEW.offset = this.offset;
    STATE_NEW.overflowMenu = this.overflowMenu;
    STATE_NEW.customPane = this.customPane;
    _debugX(OverflowButtonV1.getClassName(), 'ngOnInit',
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
    STATE_NEW.offset = this.offset;
    STATE_NEW.overflowMenu = this.overflowMenu;
    STATE_NEW.customPane = this.customPane;
    _debugX(OverflowButtonV1.getClassName(), 'ngOnChanges',
      {
        changes: changes,
        STATE_NEW: STATE_NEW,
      });

    this.state = STATE_NEW;

    this.handleDisableButton();
  }

  handleClickEvent(event: any) {
    this.onClick.emit(event);
  }

  handleDisableButton() {
    if (this.state.disabled) {
      this.overflowButtonV1.nativeElement.disabled = true;
    }
  }
}
