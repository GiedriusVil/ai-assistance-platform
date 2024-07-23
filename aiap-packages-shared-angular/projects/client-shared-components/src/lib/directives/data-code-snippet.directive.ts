/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { CodeSnippet } from 'carbon-components';

@Directive({
  selector: '[data-code-snippet]',
})
export class DataCodeSnippetDirective implements OnDestroy {
  codeSnippet: any = null;

  constructor(el: ElementRef) {
    setTimeout(() => {
      this.codeSnippet = CodeSnippet.create(el.nativeElement);
    }, 0);
  }

  ngOnDestroy() {
    this.codeSnippet.release();
  }
}
