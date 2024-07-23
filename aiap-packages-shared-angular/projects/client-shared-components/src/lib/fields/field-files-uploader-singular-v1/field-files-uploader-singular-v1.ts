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
  Optional,
} from '@angular/core';

import {
  ControlContainer,
  NgForm,
} from '@angular/forms';

import lodash from 'lodash';

import {
  _debugX
} from 'client-shared-utils';

@Component({
  selector: 'aiap-field-files-uploader-singular-v1',
  templateUrl: './field-files-uploader-singular-v1.html',
  styleUrls: ['./field-files-uploader-singular-v1.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (controlContainer?: ControlContainer) => controlContainer,
      deps: [[new Optional(), NgForm]]
    }
  ]
})
export class FieldFilesUploaderSingularV1 implements OnInit, OnChanges {

  static getClassName() {
    return 'FieldFilesUploaderSingularV1';
  }

  @Input() title: string;
  @Input() description: string;
  @Input() dropText: string;
  @Input() accept: Array<string>;

  @Input() tooltipRemove: string;

  @Input() isRequired = false;
  @Input() isDisabled = false;

  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();

  _state = {
    title: null,
    description: null,
    dropText: null,
    accept: null,
    isRequired: false,
    isDisabled: false,
    files: new Set(),
    file: null,
  };
  state = lodash.cloneDeep(this._state)

  constructor() {
    //
  }

  ngOnInit(): void {
    const STATE_NEW = lodash.cloneDeep(this._state);

    STATE_NEW.title = this.title;
    STATE_NEW.description = this.description;
    STATE_NEW.dropText = this.dropText;
    STATE_NEW.accept = this.accept;

    STATE_NEW.isRequired = this.isRequired;
    STATE_NEW.isDisabled = this.isDisabled;

    STATE_NEW.files.clear();
    STATE_NEW.file = null;

    if (
      this.value
    ) {
      STATE_NEW.files.add({
        file: this.value,
      });
      STATE_NEW.file = this.value;
    }

    _debugX(FieldFilesUploaderSingularV1.getClassName(), 'ngOnInit',
      {

        STATE_NEW,
      });

    this.state = STATE_NEW;
  }

  ngOnChanges(changes: SimpleChanges): void {

    const STATE_NEW = lodash.cloneDeep(this.state);

    STATE_NEW.title = this.title;
    STATE_NEW.description = this.description;
    STATE_NEW.dropText = this.dropText;
    STATE_NEW.accept = this.accept;

    STATE_NEW.isRequired = this.isRequired;
    STATE_NEW.isDisabled = this.isDisabled;

    STATE_NEW.files.clear();

    if (
      this.value
    ) {
      STATE_NEW.files.add({
        file: this.value,
      });
      STATE_NEW.file = this.value;
    }
    _debugX(FieldFilesUploaderSingularV1.getClassName(), 'ngOnChanges',
      {
        changes,
        STATE_NEW,
      });
    this.state = STATE_NEW;
  }

  handleEventFilesChange(event: any) {
    const VALUE_NEW = this.state?.files?.values()?.next()?.value?.file;
    const STATE_NEW = lodash.cloneDeep(this._state);
    STATE_NEW.file = VALUE_NEW;
    _debugX(FieldFilesUploaderSingularV1.getClassName(), 'handleEventFilesChange',
      {
        event: event,
        STATE_NEW: STATE_NEW,
        STATE_NEW_FILE_NAME: STATE_NEW?.file?.name,
      })
    this.state = STATE_NEW;
    this.valueChange.emit(VALUE_NEW);
  }

  handleEventSoftFileRemove(event: any) {
    _debugX(FieldFilesUploaderSingularV1.getClassName(), 'handleEventSoftFileRemove',
      {
        event,
      });
    const STATE_NEW = lodash.cloneDeep(this._state);
    STATE_NEW.files.clear();
    STATE_NEW.file = null;
    this.state = STATE_NEW;
    this.valueChange.emit(null);
  }

}
