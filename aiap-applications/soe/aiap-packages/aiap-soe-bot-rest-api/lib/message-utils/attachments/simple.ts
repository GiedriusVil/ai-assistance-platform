/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const transform = message => {
  const result: any = {};

  const attachmentType = message?.attachment?.type;
  const attachments = message?.attachment?.attachments;

  if (
    Array.isArray(attachments) &&
    attachments.length > 0
  ) {
    //Use first object from attachments array
    const attachmentToTransform = attachments[0];

    //Check if url is provided, since it's required
    if (
      attachmentToTransform.url
    ) {
      const attachment = {
        type: attachmentType,
        payload: {
          url: attachmentToTransform.url,
          is_reusable: true,
        },
      };
      result.attachment = attachment;
    } else {
      throw new Error(`No 'url' attribute provided`);
    }
  }
  return result;
};

export {
  transform,
}
