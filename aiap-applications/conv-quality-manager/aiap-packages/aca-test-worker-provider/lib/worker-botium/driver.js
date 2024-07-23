/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/
const BotDriver = require('botium-core').BotDriver;

class AcaBotDriver extends BotDriver {

    constructor(caps = {}, sources = {}, envs = {}) {
        super(caps, sources, envs);
    }
    
}

module.exports = {
    AcaBotDriver
}
