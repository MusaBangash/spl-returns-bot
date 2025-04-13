import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const { authState, login, updateUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      // Check if it's the first login and terms have not been accepted
      if (authState.user?.isFirstLogin && !authState.user?.acceptedTerms) {
        setIsFirstLogin(true);
        setTermsDialogOpen(true);
      } else {
        navigate('/');
      }
    }
  }, [authState.isAuthenticated, authState.user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    await login(email, password);
  };

  const handleTermsAccept = () => {
    if (authState.user && acceptTerms) {
      const updatedUser = {
        ...authState.user,
        isFirstLogin: false,
        acceptedTerms: true,
      };
      
      updateUser(updatedUser);
      setTermsDialogOpen(false);
      navigate('/');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
            SPL Returns Bot
          </Typography>
          
          <Typography variant="subtitle1" sx={{ mb: 4, textAlign: 'center' }}>
            Log in to manage your returns easily
          </Typography>

          {authState.error && (
            <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
              {authState.error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <FormControlLabel
              control={
                <Checkbox 
                  value="remember" 
                  color="primary" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
              sx={{ mb: 2 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={authState.isLoading || !email || !password}
              sx={{ 
                py: 1.5,
                mt: 2,
                mb: 3,
                fontSize: '1rem',
              }}
            >
              {authState.isLoading ? <CircularProgress size={24} /> : "Log In"}
            </Button>
            
            <Box sx={{ display: 'flex', width: '100%', mt: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'right' }}>
                <Link href="#" variant="body2">
                  Contact support
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* First Login Terms & Conditions Dialog */}
        <Dialog open={termsDialogOpen} maxWidth="md">
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Welcome to SPL Returns Bot. Before you can use our service, please read and accept the following terms and conditions.
            </Typography>
            
            <Box sx={{ maxHeight: '300px', overflowY: 'auto', p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2">
                <strong>1. ACCEPTANCE OF TERMS</strong><br />
                By accessing or using the SPL Returns Bot service, you agree to be bound by these Terms and Conditions.
                <br /><br />
                <strong>2. PRIVACY POLICY</strong><br />
                Your use of the service is also subject to our Privacy Policy, which describes how we collect, use, and protect your personal information.
                <br /><br />
                <strong>3. USER ACCOUNTS</strong><br />
                You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                <br /><br />
                <strong>4. RETURNS POLICY</strong><br />
                All returns are subject to SPL's return policies, including:
                <br />
                - Items must be returned within specified timeframes<br />
                - Certain items may be subject to restocking fees<br />
                - All returns require proper authorization<br />
                <br /><br />
                <strong>5. LIMITATION OF LIABILITY</strong><br />
                SPL shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
                <br /><br />
                <strong>6. GOVERNING LAW</strong><br />
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which SPL operates.
              </Typography>
            </Box>
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
              }
              label="I have read and accept the terms and conditions"
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleTermsAccept} 
              disabled={!acceptTerms}
              variant="contained"
            >
              Accept & Continue
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default LoginPage; 