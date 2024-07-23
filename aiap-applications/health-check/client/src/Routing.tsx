/*
  © Copyright IBM Corporation 2023. All Rights Reserved 
   
  SPDX-License-Identifier: EPL-2.0
*/
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { ApplicationContext } from './context/ApplicationContext';
import { APPLICATION_CONTEXT } from './types/ApplicationContext';
import EventStreamsView from './views/EventStreamsView';
import Home from './views/Home';
import MongoClientsView from './views/MongoClientsView';
import NotFound from './views/NotFound';
import RedisClientsView from './views/RedisClientsView';
import Settings from './views/Settings';

const Routing = () => {
  const { session }: APPLICATION_CONTEXT = useContext(ApplicationContext);
  return (
    <Router basename={session?.application?.configuration?.route}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="surgeon">
            <Route path="mongo-clients" element={<MongoClientsView />}/>
            <Route path="redis-clients" element={<RedisClientsView />}/>
            <Route path="event-streams" element={<EventStreamsView />}/>
          </Route>
          <Route path="settings" element={<Settings />}/>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default Routing;
