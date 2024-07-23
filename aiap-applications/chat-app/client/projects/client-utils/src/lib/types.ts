/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
export interface Methods {
  connect: (apiKey?: string) => void;
  handleIncomingMessage: (incoming: any) => void;
  postMessage: (message: any) => void;
  disconnectChat: () => void;
  disconnectFromWidget: () => void;
  postAudioMessage: (message: any) => void;
}

export interface WidgetParams {
  minimized: boolean;
  widget: boolean;
  width: string;
}

export interface UserMsg {
  type?: 'user' | 'bot';
  text: string;
  timestamp?: number;
  attachment?: {
    type: 'form';
    data: string;
  };
}

export enum AttachmentType {
  feedback = 'feedback',
  image = 'image',
  buttons = 'buttons'
}

export interface ConversationToken {
  token: string;
  expire: number;
}

export interface ConversationCookie {
  conversationToken: string;
  expire: number;
  surveySubmitted?: boolean;
}

export type Language = 'en';
