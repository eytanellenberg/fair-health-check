import { Analytics } from "@vercel/analytics/react";
import React from 'react';
import FairHealthCheck from './FairHealthCheck';
import './App.css';

function App() {
  return (
    <div className="App">
      <FairHealthCheck />
      <Analytics />   {/* → Analytics doit être placé INSIDE le return */}
    </div>
  );
}

export default App;
