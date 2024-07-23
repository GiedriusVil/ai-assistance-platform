/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

class AuditRecord {
  
  constructor(builder) {
    this.type = builder.type;
    this.userId = builder.userId;
    this.approver = builder.approver;
    this.actionApproved = builder.actionApproved;
    this.timestamp = new Date();
    this['action'] = builder['action'];
    this.externalId = builder.externalId;
    this.comment = builder.comment;
    this.params = builder.params;
  }

  static get builder() {
    class AuditRecordBuilder {
      constructor(type) {
        this.type = type;
      }

      byUserId(userId) {
        this.userId = userId;
        return this;
      }

      onAction(action) {
        this['action'] = action;
        return this;
      }

      withExternalId(id) {
        this.externalId = id;
        return this;
      }

      withApprover(id) {
        this.approver = id;
        return this;
      }

      withStatus(actionApproved) {
        this.actionApproved = actionApproved;
        return this;
      }

      withComment(comment) {
        if (comment.initiator) {
          this.comment = comment;
        } else {
          this.comment = { initiator: comment, approver: null };
        }
        return this;
      }

      withParams(params) {
        this.params = params;
        return this;
      }

      build() {
        return new AuditRecord(this);
      }
    }
    return AuditRecordBuilder;
  }
}

module.exports = {
  AuditRecord
};
