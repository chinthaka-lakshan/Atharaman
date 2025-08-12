import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material';
import { Close, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const AuthModals = ({ open, onClose, mode, onModeChange }) => {
  const { login, register, forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [forgotEmail, setForgotEmail] = useState('');

  const handleClose = () => {
    setError('');
    setSuccess('');
    setLoginData({ email: '', password: '' });
    setRegisterData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    setForgotEmail('');
    onClose();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(loginData);
    
    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const result = await register(registerData);
    
    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await forgotPassword(forgotEmail);
    
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const renderLoginForm = () => (
    <Box component="form" onSubmit={handleLogin}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>
        Welcome Back
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        fullWidth
        label="Email or Username"
        type="email"
        value={loginData.email}
        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
        sx={{ mb: 2 }}
        required
      />
      
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={loginData.password}
        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
        sx={{ mb: 2 }}
        required
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{
          mb: 2,
          background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
          py: 1.5,
        }}
      >
        {loading ? <CircularProgress size={24} /> : 'Login'}
      </Button>
      
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Link
          component="button"
          type="button"
          onClick={() => onModeChange('forgot')}
          sx={{ color: 'primary.main', textDecoration: 'none' }}
        >
          Forgot Password?
        </Link>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Don't have an account?
        </Typography>
        <Button
          onClick={() => onModeChange('register')}
          variant="outlined"
          fullWidth
        >
          Create Account
        </Button>
      </Box>
    </Box>
  );

  const renderRegisterForm = () => (
    <Box component="form" onSubmit={handleRegister}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>
        Create Account
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="First Name"
          value={registerData.firstName}
          onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
          required
        />
        <TextField
          fullWidth
          label="Last Name"
          value={registerData.lastName}
          onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
          required
        />
      </Box>
      
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={registerData.email}
        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
        sx={{ mb: 2 }}
        required
      />
      
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={registerData.password}
        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
        sx={{ mb: 2 }}
        required
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />
      
      <TextField
        fullWidth
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        value={registerData.confirmPassword}
        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
        sx={{ mb: 2 }}
        required
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{
          mb: 2,
          background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
          py: 1.5,
        }}
      >
        {loading ? <CircularProgress size={24} /> : 'Create Account'}
      </Button>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Already have an account?
        </Typography>
        <Button
          onClick={() => onModeChange('login')}
          variant="outlined"
          fullWidth
        >
          Login
        </Button>
      </Box>
    </Box>
  );

  const renderForgotPasswordForm = () => (
    <Box component="form" onSubmit={handleForgotPassword}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 700 }}>
        Reset Password
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
        Enter your email address and we'll send you a link to reset your password.
      </Typography>
      
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={forgotEmail}
        onChange={(e) => setForgotEmail(e.target.value)}
        sx={{ mb: 3 }}
        required
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        sx={{
          mb: 2,
          background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
          py: 1.5,
        }}
      >
        {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
      </Button>
      
      <Box sx={{ textAlign: 'center' }}>
        <Button
          onClick={() => onModeChange('login')}
          variant="text"
        >
          Back to Login
        </Button>
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -1 }}>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>
      
      <DialogContent sx={{ px: 4, pb: 4 }}>
        {mode === 'login' && renderLoginForm()}
        {mode === 'register' && renderRegisterForm()}
        {mode === 'forgot' && renderForgotPasswordForm()}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModals;