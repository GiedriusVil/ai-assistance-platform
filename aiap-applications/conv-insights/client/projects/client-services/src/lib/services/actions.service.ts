/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import { Injectable } from '@angular/core';
import { ConversationService } from './conversation.service';
import { SupervisorActionsService } from './supervisor-actions.service';

@Injectable()
export class ActionsService {

  constructor(
    private conversationService: ConversationService, 
    private supervisorActionsService: SupervisorActionsService,
  ) {}

  async deleteConversations(action: any, actionApproved: boolean) {

    const DATA = {
      comment: action.comment,
      initiator: action.initiator,
      actionApproved: actionApproved
    };

    const EMPLOYEE_ID = action.reference['employeeId'];
    const CONVERSATION_ID = action.reference['conversationId'];

    let result:any ;
    if (EMPLOYEE_ID) {
      result = this.conversationService.deleteByEmployeeId(EMPLOYEE_ID, DATA);
    } else {
      result = this.conversationService.delete(CONVERSATION_ID, DATA);
    }

    if (result) {
      await this.supervisorActionsService.deleteAction(action._id);
    }
  }
}
