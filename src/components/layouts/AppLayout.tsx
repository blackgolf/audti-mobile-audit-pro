
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppNavbar from './AppNavbar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
