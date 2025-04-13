import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Theme
import theme from './theme/theme';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ReturnsProvider } from './context/ReturnsContext';
import { ChatProvider } from './context/ChatContext';

// Pages (to be created)
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewReturnPage from './pages/NewReturnPage';
import ReturnDetailPage from './pages/ReturnDetailPage';
import HistoryPage from './pages/HistoryPage';
import ChatPage from './pages/ChatPage';

// Authentication Guards
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ReturnsProvider>
          <ChatProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<PrivateRoute element={<DashboardPage />} />} />
                <Route path="/returns/new" element={<PrivateRoute element={<NewReturnPage />} />} />
                <Route path="/returns/:id" element={<PrivateRoute element={<ReturnDetailPage />} />} />
                <Route path="/history" element={<PrivateRoute element={<HistoryPage />} />} />
                <Route path="/chat" element={<PrivateRoute element={<ChatPage />} />} />
                
                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </ChatProvider>
        </ReturnsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
