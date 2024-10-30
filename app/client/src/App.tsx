import { useState } from 'react';
import Box from '@mui/material/Box';
import SignInSide from './components/material-ui-templates/sign-in-side/SignInSide';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/material-ui-templates/dashboard/Dashboard';

function App() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Routes>
        <Route path="/sign-in" element={<SignInSide />} />
        <Route path="/sign-up" element={<SignInSide isSignUp />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/files/*" element={<Dashboard />} />
        <Route path="/links" element={<Dashboard />} />
      </Routes>
    </Box>
  );
}

export default App;