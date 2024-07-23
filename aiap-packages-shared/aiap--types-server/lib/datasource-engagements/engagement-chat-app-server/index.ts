export interface IEngagementChatAppServerV1 {
  channel2Connect?: string,
  channels?: {
    socketio?: {
      type?: string,
      external?: {
        url?: string,
        path?: string,
        transports?: Array<any>,
      }
    },
    teliaAce001?: {
      type?: string,
      external?: {
        authentication?: any,
        conversation?: any,
      },
    },
    teliaAce002?: {
      type?: string,
      external?: {
        authentication?: any,
        conversation?: any,
      },
    },
    rocketchat001?: {
      type?: string,
      external?: {
        websocket?: any,
      },
    },
    genesys001?: {
      type?: string,
      external?: {
        version?: string,
        skill?: string,
        environment?: string,
        service?: string,
        url?: string,
        pollingInterval?: number,
        onDisconnectAction?: string,
      }
    }
  },
  voiceServices?: {
    sttServiceId?: string,
    ttsServiceId?: string,
  }
}
