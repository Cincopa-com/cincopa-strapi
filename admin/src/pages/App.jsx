import { Page } from '@strapi/strapi/admin';
import React, { useEffect } from 'react';
import { Routes, Route ,useNavigationType, useLocation } from 'react-router-dom';
import { PLUGIN_ID } from '../pluginId';

import { HomePage } from './HomePage';

const App = () => {

  const navType = useNavigationType();
  const { pathname } = useLocation();

  useEffect(() => {
    // only when clicking into the plugin via the SPA
    if (
      navType === 'PUSH' &&
      pathname.includes(`/plugins/${PLUGIN_ID}`)
    ) {
      // do a real browser GET so your server‐side CSP kicks in
      window.location.assign(window.location.href);
    }
  }, [navType, pathname]);


  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="*" element={<Page.Error />} />
    </Routes>
  );
};

export { App };
