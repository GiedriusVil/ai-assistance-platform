/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import React from 'react';
import axios from 'axios';

export const getMongoClients = async () => {
    const RESPONSE = await axios.get('/api/v1/surgeon/mongo-clients');
    const RET_VAL = RESPONSE.data;
    return RET_VAL;
};

export const getRedisClients = async () => {
    const RESPONSE = await axios.get('/api/v1/surgeon/redis-clients');
    const RET_VAL = RESPONSE.data;
    return RET_VAL;
};

export const getEventStreams = async () => {
    const RESPONSE = await axios.get('/api/v1/surgeon/event-streams');
    const RET_VAL = RESPONSE.data;
    return RET_VAL;
};
