/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(
    protected sanitizer: DomSanitizer
  ) { }

  public transform(value: any, type: string) {
    switch (type) {
      case 'html':
        return this.sanitizer['bypassSecurityTrustHtml'](value);
      case 'style':
        return this.sanitizer['bypassSecurityTrustStyle'](value);
      case 'script':
        return this.sanitizer['bypassSecurityTrustScript'](value);
      case 'url':
        return this.sanitizer['bypassSecurityTrustUrl'](value);
      case 'resourceUrl':
        return this.sanitizer['bypassSecurityTrustResourceUrl'](value);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
