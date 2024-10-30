import Box from '@mui/material/Box';
import SignInSide from './components/material-ui-templates/sign-in-side/SignInSide';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/material-ui-templates/dashboard/Dashboard';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Routes>
          <Route path="/sign-in" element={<SignInSide />} />
          <Route path="/sign-up" element={<SignInSide isSignUp />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/files/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/links" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </Box>
    </AuthProvider>
  );
}

export default App;
