import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Landing }   from './pages/Landing';
import { Workspace } from './pages/Workspace';
import { Dashboard } from './pages/Dashboard';
import { Compiler }  from './pages/Compiler';
import { Settings }  from './pages/Settings';
import '@/App.css';

/* Minimal fade transition for route changes */
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

/* Inner component so useLocation is inside BrowserRouter */
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/workspace" element={<PageWrapper><Workspace /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/compiler"  element={<PageWrapper><Compiler /></PageWrapper>} />
        <Route path="/settings"  element={<PageWrapper><Settings /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;