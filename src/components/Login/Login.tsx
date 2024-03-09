// Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, sendPasswordResetEmail} from 'firebase/auth';
import { auth } from '../../utils/firebase-config';
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [isResetPassword, setIsResetPassword] = useState(false); 
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in: ', error);
    }
  }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      alert('Password reset email sent.');
      setIsResetPassword(false); 
    } catch (error) {
      console.error('Error sending password reset email: ', error);
      alert('Error: check that your email is entered correctly ');
    }
  };


  const handleProviderLogin = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error with provider login: ', error);
    }
  };


  const validateForm = () => {
    let isValid = true;
  
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email address is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }
  
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
  
    return isValid;
  };


  return (
    <div className="login-container container">
      {!isResetPassword ? (
        <div className="login-card">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              placeholder='Enter your email'
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="full-width-input"
            />

            {emailError && <p className="error-message">{emailError}</p>}
    
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                placeholder='Enter your password'
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="full-width-input"
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={togglePasswordVisibility}
                className="password-icon"
              />
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
  
            <div className="forgot-password-link" onClick={() => setIsResetPassword(true)}>
              Forgot password?
            </div>
    
            <button type="submit" className="login-button">Login</button>
          </form>

          <div className='login-divider'>
          <div className='divider'></div>
          </div>
          <p className='login-divider-p'>OR</p>
          <div className="provider-login">
            <button onClick={() => handleProviderLogin(new GoogleAuthProvider())}>
              <img src="/assets/Google.svg" alt="google icon" />Login with Google
            </button>
            <button onClick={() => handleProviderLogin(new FacebookAuthProvider())}>
              <img src="/assets/Icon/Facebook.svg" alt="facebook icon" /> Login with Facebook
            </button>
          </div>
        </div>
      
      ) : (
        <div className="login-card forgot-password-container">
          <h2>Reset Password</h2>
          <div className="forgot-password-form">
          <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              className="full-width-input"
            />
            <div className="forgot-password-form-btn">
              <button onClick={() => setIsResetPassword(false)} className="cancel-reset-button">Cancel</button>
              <button onClick={handleForgotPassword} className="send-reset-button">Send reset email</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  };
  
  
export default Login;