import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'partOfText' })
export class PartOfTextPipe implements PipeTransform {
  transform(text: string, chars?: number) {
    if (text) {
      const cutToChars = isNaN(chars) ? 430 : chars;
      const suffix = text.length < cutToChars ? '' : '...';
      return text.substr(0, cutToChars) + suffix;
    }
  }
}
