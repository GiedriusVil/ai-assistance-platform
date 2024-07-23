/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { TextInput } from 'carbon-components';

@Directive({
  selector: '[data-text-input]',
})
export class DataTextInputDirective implements OnDestroy {
  textInput: any = null;

  constructor(el: ElementRef) {
    setTimeout(() => {
      this.textInput = TextInput.create(el.nativeElement);
    }, 0);
  }

  ngOnDestroy() {
    this.textInput.release();
  }
}
