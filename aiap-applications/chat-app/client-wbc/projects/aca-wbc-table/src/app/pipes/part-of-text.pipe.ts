/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'partOfText' })
export class PartOfTextPipe implements PipeTransform {

  transform(text: string, chars?: number) {
    let tmpChars: number = 430;
    if (chars) {
      tmpChars = chars;
    }
    if (text) {
      const suffix = text.length < tmpChars ? '' : '...';
      return text.substr(0, tmpChars) + suffix;
    }
    return '...';
  }
}
