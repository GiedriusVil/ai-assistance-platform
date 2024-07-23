/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'aiap-conversation-info-modal-v1',
  templateUrl: './conversation-info-modal-v1.html',
  styleUrls: ['./conversation-info-modal-v1.scss'],
})
export class ConversationInfoModalV1 implements OnInit, OnDestroy, AfterViewInit {

  private _destroyed$: Subject<void> = new Subject();
  isOpen: boolean = false;

  selectedConversation = {};

  conversation: any = {
    _id: null,
  };

  comment: any;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() { }

  ngOnDestroy() { }

  show(conversation: any = null) {
    this.conversation = conversation;
    this.isOpen = true;
  }


}
