/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { Howl } from 'howler';
import * as R from 'ramda';

import {
  ChatWidgetServiceV1,
  EventsServiceV1,
  ConfigServiceV2,
} from "client-services";

@Component({
  selector: 'aca-chat-audio',
  templateUrl: './audio.html'
})
export class AudioComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private eventsService: EventsServiceV1,
    private configService: ConfigServiceV2,
    private chatWidgetService: ChatWidgetServiceV1
  ) { }

  sound: Howl = undefined;

  @ViewChild('main') main;
  @ViewChild('container') container;

  private eventsSubscription: Subscription;
  chatAssestsUrl: string;
  ngAfterViewInit() { }

  ngOnInit() {
    this.getAssetsUrl();
    this.eventsSubscription = this.eventsService.eventsEmitter.subscribe(event => {
      if (event.hasOwnProperty('onAudioPlay')) this.playAudio();
    });

    this.sound = new Howl({
      src: [`${this.chatAssestsUrl}/chime.mp3`],
      autoplay: false,
      loop: false,
      preload: true
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  getAssetsUrl() {
    this.chatAssestsUrl = this.chatWidgetService.getChatAppHostUrl() + "/en-US/assets";
  }

  private playAudio(): void {
    const RAW_WIDGET_AUDIO = localStorage.getItem('widgetAudio');
    let audioEnabled = false;
    if (RAW_WIDGET_AUDIO) {
      audioEnabled = JSON.parse(RAW_WIDGET_AUDIO);
    } else {
      audioEnabled = R.pathOr(false, ['audioEnabled'], this.configService.get());
    }

    if (audioEnabled) {
      if (this.sound.playing()) {
        this.sound.stop();
      }

      setTimeout(() => {
        this.sound.play();
      }, 0);
    }
  }
}
