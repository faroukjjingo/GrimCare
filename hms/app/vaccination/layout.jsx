// vaccination/layout.jsx
import React from 'react';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const VaccinationLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

export default VaccinationLayout;
