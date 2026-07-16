import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './LayoutWrapper.css';

export const LayoutWrapper = ({ children, type = 'default' }) => {
  return (
    <div className="layout-root">
      <Header />
      
      {type === 'default' ? (
        <main className="main-content animate-fade-in">
          {children}
        </main>
      ) : (
        <main className="main-content dashboard-layout-container container py-8 animate-fade-in">
          <Sidebar type={type} />
          <div className="dashboard-content-panel">
            {children}
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
};
export default LayoutWrapper;
