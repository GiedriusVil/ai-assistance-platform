/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

import {
  _debugX
} from 'client-utils';

@Component({
  selector: 'aca-chat-form-attachment',
  templateUrl: './form.attachment.html',
  styleUrls: ['./form.attachment.scss']
})
export class FormAttachment implements OnInit {

  static getClassName() {
    return 'FormAttachment';
  }

  @Input() message: any;
  @Input() index: any;

  @Output() userActionEvent = new EventEmitter<any>();

  private data: any;

  elements = [];
  attributes;
  form: UntypedFormGroup;
  locked = false;

  ngOnInit() {
    // Commented after move to wbc, attachment won't be working as expected.
    // this.data = this.storageService.getTranscript();
    _debugX(FormAttachment.getClassName(), 'transcript: ', { this_data: this.data });

    this.elements = this.message.attachment.elements;
    this.attributes = this.message.attachment.attributes;
    this.form = this.toFormGroup();
    this.formInit();
  }

  toFormGroup() {
    const group = {};
    const emailRegex = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    this.elements.forEach(element => {
      if (element.tag === 'input' && element.type === 'text') {
        group[element.name] = new UntypedFormControl(null, Validators.required);
      }
      if (element.tag === 'input' && element.type === 'email') {
        group[element.name] = new UntypedFormControl(null, [Validators.required, Validators.pattern(emailRegex)]);
      }
      if (element.tag === 'input' && element.type === 'date') {
        group[element.name] = new UntypedFormControl(null, [Validators.required, Validators.pattern(dateRegex)]);
      }
    });

    return new UntypedFormGroup(group);
  }

  onInputButtonSubmit() {
    if (this.form.valid) {
      let formName;
      if (this.attributes && this.attributes.name) {
        formName = this.attributes.name;
      }
      const MESSAGE = {
        type: 'POST_MESSAGE',
        data: {
          //TODO missing type user
          text: formName,
          attachment: {
            type: 'form',
            data: this.form.value
          }
        }
      };
      this.userActionEvent.emit(MESSAGE);

      this.formSubmit(this.form.value);
    } else {
      this.markAllInputsAsTouched();
    }
  }

  onInputButtonClose(element: any) {
    const MESSAGE = {
      type: 'POST_MESSAGE',
      data: {
        //TODO missing type user
        text: element.title
      }
    };
    this.userActionEvent.emit(MESSAGE);
    this.formClose(element.title);
  }

  isFieldWithErrors(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  formInit() {
    this.locked = true;
  }

  formSubmit(value) {
    const _text = Object.keys(value).reduce((text, key) => (text += `${key}: ${value[key]}<br>`), '');
    this.data.splice(this.index, 1, { type: 'user', text: _text, timestamp: new Date().getTime() });
    this.locked = false;
  }

  formClose(value) {
    this.data.splice(this.index, 1, { type: 'user', text: value, timestamp: new Date().getTime() });
    this.locked = false;
  }

  markAllInputsAsTouched() {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }
}
