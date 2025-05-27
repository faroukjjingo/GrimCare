import React from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const MktReferralLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default MktReferralLayout;
