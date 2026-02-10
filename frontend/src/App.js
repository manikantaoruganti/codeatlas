import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Workspace } from './pages/Workspace';
import { Dashboard } from './pages/Dashboard';
import { Compiler } from './pages/Compiler';
import { Settings } from './pages/Settings';
import '@/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/compiler" element={<Compiler />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;