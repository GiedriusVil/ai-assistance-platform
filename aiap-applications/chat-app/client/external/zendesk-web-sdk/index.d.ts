export as namespace zChat;

export function init(options: any): any;
export function on(event_name: any, handler: any): any;
export function getAccountStatus(): any;
export function getAllDepartments(): any;
export function clearVisitorDefaultDepartment(callback?: any): any;
export function setVisitorInfo(options: any, callback?: any): any;
export function setVisitorDefaultDepartment(id: any, callback?: any): any;
export function addTags(tags: any, callback?: any): any;
export function sendChatMsg(msg: any, callback?: any): any;
export function sendTyping(is_typing: any): any;
export function un(event_name: any, handler: any): any;
export function endChat(options?: any, callback?: any): any;
