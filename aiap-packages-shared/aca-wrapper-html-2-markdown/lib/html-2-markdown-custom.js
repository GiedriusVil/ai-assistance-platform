/*
  © Copyright IBM Corporation 2022. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
const html2MarkdownCustom = text => {

  // Remove CSS styling from tags
  text = text.replace(/ style=".*"/g, '');
  // Format <b>, <strong>, <i>, <h*>, <p> and <br />
  text = text
    .replace(/(<b>|<\/b>|<b> | <\/b>)/g, '*')
    .replace(/(<strong>|<\/strong>|<strong> | <\/strong>)/g, '*')
    .replace(/<h.>/g, '\n*')
    .replace(/<\/h.>/g, '*')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n')
    .replace(/(<i>|<\/i>|<i> | <\/i>)/g, '_')
    .replace(/<br \/>/g, '\n');
  // Format <ol>
  while (text.indexOf('<ol') > -1 && text.indexOf('</ol>') > -1) {
    const startIndex = text.indexOf('<ol');
    const endIndex = text.indexOf('</ol>') + '</ol>'.length;
    let result = text.slice(startIndex, endIndex);
    result = result.replace(/<ol>/, '').replace(/<\/ol>/, '');
    let counter = 1;
    while (result.indexOf('<li>') > -1 && result.indexOf('</li>') > -1) {
      result = result.replace('<li>', `${counter}. `).replace('</li>', '\n');
      counter += 1;
    }

    text = `${text.slice(0, startIndex)}${result}${text.slice(endIndex)}`;
  }
  // Format <ul>
  while (text.indexOf('<ul') > -1 && text.indexOf('</ul>') > -1) {
    const startIndex = text.indexOf('<ul');
    const endIndex = text.indexOf('</ul>') + '</ul>'.length;
    let result = text.slice(startIndex, endIndex);
    result = result.replace(/<ul>/, '').replace(/<\/ul>/, '');
    while (result.indexOf('<li>') > -1 && result.indexOf('</li>') > -1) {
      result = result.replace('<li>', `- `).replace('</li>', '\n');
    }

    text = `${text.slice(0, startIndex)}${result}${text.slice(endIndex)}`;
  }
  //Format <u>
  while (text.indexOf('<u') > -1 && text.indexOf('</u>') > -1) {
    const startIndex = text.indexOf('<u');
    const endIndex = text.indexOf('</u>') + '</u>'.length;
    let result = text.slice(startIndex, endIndex);
    result = result.replace(/<u>/, '_').replace(/<\/u>/, '_');
    text = `${text.slice(0, startIndex)}${result}${text.slice(endIndex)}`;
  }
  // Format <a>
  text = text.replace(/ target="_blank"/g, '');
  // eslint-disable-next-line no-useless-escape
  text = text.replace(/ class="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/g, '');
  while (text.indexOf('<a href="') > -1 && text.indexOf('</a>') > -1) {
    const startIndex = text.indexOf('<a href="');
    const endIndex = text.indexOf('</a>') + '</a>'.length;
    let result = text.slice(startIndex, endIndex);
    result = result.replace('“', '');
    result = result
      .replace('<a href="', '<')
      .replace('">', '|')
      .replace('</a>', '>');

    text = `${text.slice(0, startIndex)}${result}${text.slice(endIndex)}`;
  }
  text = text.replace(/ target="_blank"/g, '');
  while (text.indexOf('<a class="link-id" href="') > -1 && text.indexOf('</a>') > -1) {
    const startIndex = text.indexOf('<a class="link-id" href="');
    const endIndex = text.indexOf('</a>') + '</a>'.length;
    let result = text.slice(startIndex, endIndex);
    result = result.replace('“', '');
    result = result
      .replace('<a class="link-id" href="', '<')
      .replace('">', '|')
      .replace('</a>', '>');

    text = `${text.slice(0, startIndex)}${result}${text.slice(endIndex)}`;
  }
  // Remove table tags since slack does not support tables
  // while (text.indexOf('<table') > -1 && text.indexOf('</table>') > -1) {
  //   const startIndex = text.indexOf('<table');
  //   const endIndex = text.indexOf('</table>') + '</table>'.length;
  //   const warningMsg = '`Content removed: Slack does not support tables.`';

  //   text = `${text.slice(0, startIndex)}${warningMsg}${text.slice(endIndex)}`;
  // }
  while (text.indexOf('<div') > -1 && text.indexOf('</div>') > -1) {
    text = text.replace(/(<([^>]+)>)/ig, '\n');
  }

  // Format </br>
  text = text.replace(/<br\s*\/?>/gi, '\n');
  // text = text.replace(/(<([^>]+)>)/ig, '');
  text = text.replace(/<\/?br*>/gi, '');
  // text = text.replace(/^\s+|\s+$/gm,'');

  return text;
};

module.exports = {
  html2MarkdownCustom,
}
