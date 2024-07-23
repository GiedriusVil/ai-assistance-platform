import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractValueMessage'
})
export class ExtractValueMessagePipe implements PipeTransform {

  transform(message: any): string {
    const RET_VAL = message.payload ?? message.text;

    return RET_VAL;
  }
}
