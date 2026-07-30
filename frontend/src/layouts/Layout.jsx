import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 md:pb-0 md:pl-64">
      {/* Navigation will go here */}
      <main className="p-4 md:p-6 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
