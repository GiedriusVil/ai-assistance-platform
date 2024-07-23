/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'ChannelIcon',
})
export class ChannelIconPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) { }

  transform(value: any): any {
    if (value.toLowerCase() === 'incontact') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' + value + '" src="/assets/logos/nice-incontact-logo.png" style="height: 14px;"/>'
      );
    }

    if (value.toLowerCase() === 'chatapi') {
      return this.domSanitizer.bypassSecurityTrustHtml('<strong>{ REST API }</strong>');
    }

    if (value.toLowerCase() === 'slack') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' + value + '" src="/assets/logos/slack-logo.png" style="height: 14px;"/>'
      );
    }

    if (value.toLowerCase() === 'livepersonsync') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' + value + '" src="/assets/logos/live-person-logo.png" style="height: 20px;"/>'
      );
    }

    if (value.toLowerCase() === 'socket.io') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' + value + '" src="/assets/logos/socket-io-logo.svg" style="height: 20px;"/>'
      );
    }

    if (value.toLowerCase() === 'lp-fb') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' +
        value +
        '" src="/assets/logos/fb-logo.png" style="height: 20px;"/>' +
        '<img alt="' +
        value +
        '" src="/assets/logos/live-person-logo.png" style="height: 20px;"/>'
      );
    }

    if (value.toLowerCase() === 'aca-alexa') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' + value + '" src="/assets/logos/alexa-logo.png" style="height: 14px;"/>'
      );
    }

    if (value.toLowerCase() === 'ls-messaging') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' + value + '" src="/assets/logos/live-person-logo.png" style="height: 20px;"/>'
      );
    }

    if (value.toLowerCase() === 'lp-sms') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' +
        value +
        '" src="/assets/logos/twilio-logo-cut.png" style="height: 20px;"/>' +
        '<img alt="\' + value + \'" src="/assets/logos/live-person-logo.png" style="height: 20px;"/>'
      );
    }

    if (value.toLowerCase() === 'aca-faceme') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' + value + '" src="/assets/logos/faceme-logo.png" style="height: 20px;"/>'
      );
    }

    if (value.toLowerCase() === 'msteams' || value.toLowerCase() === 'webchat') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' + value + '" src="/assets/logos/microsoft-teams.png" style="height: 20px;"/>'
      );
    }

    if (value.toLowerCase() === 'slack' || value.toLowerCase() === 'webchat') {
      return this.domSanitizer.bypassSecurityTrustHtml(
        '<img alt="' + value + '" src="/assets/logos/slack-logo.png" style="height: 20px;"/>'
      );
    }

    return value;
  }
}
