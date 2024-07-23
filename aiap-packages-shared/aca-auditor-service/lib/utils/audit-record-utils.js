/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/

class AuditRecord {
  
  constructor(builder) {
    this.context = builder.context; // { TBD }
    this['action'] = builder['action']; // { type }
    this.approval = builder.approval; // { id }
    //
    this.docId = builder.docId;
    this.docExtId = builder.docExtId;
    this.docType = builder.docType; 
    this.doc = builder.doc;
    this.docChanges = builder.docChanges;
    //
    this.timestamp = new Date();
  }

  static get builder() {

    class AuditRecordBuilder {

      constructor(docType) {
        this.docType = docType;
      }

      byContext(context) {
        this.context = context;
        return this;
      }

      onAction(action) {
        this['action'] = action;
        return this;
      }

      withApproval(approval) {
        this.approval = approval;
        return this;
      }

      withDocId(id) {
        this.docId = id;
        return this;
      }

      withDocExtId(id) {
        this.docExtId = id;
        return this;
      }

      withDoc(doc) {
        this.doc = doc;
        return this;  
      }

      withDocChanges(docChanges) {
        this.docChanges = docChanges;
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
  AuditRecord,
};
