import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (<div><header>PublicLayout Header</header><main><Outlet /></main></div>);
};

export default PublicLayout;
