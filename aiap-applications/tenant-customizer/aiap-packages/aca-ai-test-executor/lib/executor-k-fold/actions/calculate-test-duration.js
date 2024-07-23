/*
	© Copyright IBM Corporation 2022. All Rights Reserved 
	 
	SPDX-License-Identifier: EPL-2.0
*/

const lodash = require('@ibm-aca/aca-wrapper-lodash');

const calculateDuration = (metrics = {}) => {
    if (!lodash.isEmpty(metrics)) {
        const STARTED = metrics?.started;
        const ENDED = metrics?.ended;
        const DURATION_IN_MIL = ENDED - STARTED;
        let milliseconds = parseInt((DURATION_IN_MIL % 1000));
        let seconds = parseInt((DURATION_IN_MIL / 1000) % 60);
        let minutes = parseInt((DURATION_IN_MIL / (1000 * 60)) % 60);
        let hours = parseInt((DURATION_IN_MIL / (1000 * 60 * 60)) % 24);
        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        return hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
    }
    else {
        return '00:00:00:00';
    }
}
module.exports = {
    calculateDuration
}
