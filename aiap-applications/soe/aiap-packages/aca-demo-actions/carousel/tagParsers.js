/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
module.exports = {
  yieldFromContent,
  collectFromContent,
  firstFromContent,
  parseButtonTag,
  parseDefaultActionTag,
  parseElementTag,
};

function* yieldFromContent(content, tag, parseTag) {
  if (content == null) {
    return;
  }

  for (let childTag of content) {
    if (childTag.tag === tag) {
      yield parseTag(childTag);
    }
  }
}

function collectFromContent(content, tag, parseTag) {
  return Array.from(yieldFromContent(content, tag, parseTag));
}

function firstFromContent(content, tag, parseTag) {
  return yieldFromContent(content, tag, parseTag).next().value;
}

/*
  Button schema:
  {
    "type": "web_url",
    "title": "string",
    "url": "http://example.com"
  }
  
  {
    "type": "postback",
    "title": "string",
    "payload": "string"
  }
  
  {
    "type": "phone_number",
    "title": "string",
    "payload": "string"
  }
  
*/
function parseButtonTag(tag) {
  if (tag.tag != 'button') {
    return null;
  }
  let attrs = tag.attrs || {};
  return {
    type: attrs.type,
    title: attrs.title,
    url: attrs.url,
    payload: attrs.payload,
  };
}

/*
  DefaultAction schema:
  {
    "type": "web_url",
    "url": "http://example.com"
  }
*/
function parseDefaultActionTag(tag) {
  if (tag.tag != 'default_action') {
    return null;
  }
  let attrs = tag.attrs || {};
  return {
    type: attrs.type,
    url: attrs.url,
  };
}

/*
  Element schema:
  {
    "title": "string",
    "subtitle": "string",
    "image_url": "http://example.com",
    "default_action": DefaultAction,
    "buttons": [Button]
  }
*/
function parseElementTag(tag) {
  if (tag.tag != 'element') {
    return null;
  }
  let attrs = tag.attrs || {};
  return {
    title: attrs.title,
    subtitle: attrs.subtitle,
    image_url: attrs.image_url,
    default_action: firstFromContent(tag.content, 'default_action', parseDefaultActionTag),
    buttons: collectFromContent(tag.content, 'button', parseButtonTag),
  };
}
