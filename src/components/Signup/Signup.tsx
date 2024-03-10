//Signup.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, AuthProvider } from 'firebase/auth';
import { auth } from '../../utils/firebase-config';
import './signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthErrorCodes } from "firebase/auth";

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fullNameError, setFullNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFullNameError('');
        setEmailError('');
        setPasswordError('');
      
        if (!email || !password || !fullName.trim()) {
          setFullNameError(!fullName ? 'Full name is required' : '');
          setEmailError(!email ? 'Email is required' : '');
          setPasswordError(!password ? 'Password is required' : '');
          return;
        }
      
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          toast.success('Signed up successfully');
          navigate('/dashboard');
        } catch (error: any) {
          switch (error.code) {
            case AuthErrorCodes.EMAIL_EXISTS:
              setEmailError('This email is already in use. Please login or reset your password.');
              break;
            default:
              setEmailError('Failed to sign up. Please try again.');
              break;
          }
        }
      };

    const handleProviderSignup = async (provider: AuthProvider) => {
        try {
            await signInWithPopup(auth, provider);
            navigate('/'); 
        } catch (error) {
            console.error('Error with provider sign up: ', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    

    return (
        <div className="signup-container container">
            <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ width: "auto" }}
            closeButton={false}
            />
            <div className="signup-card">
                <h2>Sign up</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="fullName">Full name</label>
                    <input
                        id="fullName"
                        type="text"
                        placeholder="Enter your fullname"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="full-width-input"
                    />

                    {fullNameError && <p className="error-message">{fullNameError}</p>}

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="full-width-input"
                    />

                    {emailError && <p className="error-message">{emailError}</p>}

                    <label htmlFor="password">Password</label>
                    <div className="password-container">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="full-width-input"
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            onClick={togglePasswordVisibility}
                            className="sign-password-icon"
                        />
                    </div>

                    {passwordError && <p className="error-message">{passwordError}</p>}

                    <button type="submit" className="signup-button">Sign up</button>
                </form>
                <div className='login-divider'>
                <div className='divider'></div>
                </div>
                <p className='login-divider-p'>OR</p>
                <div className="provider-login">
                    <button onClick={() => handleProviderSignup(new GoogleAuthProvider())}>
                    <img src="/assets/Google.svg" alt="google icon" />Sign up with google
                    </button>
                    <button onClick={() => handleProviderSignup(new FacebookAuthProvider())}>
                    <img src="/assets/Icon/Facebook.svg" alt="facebook icon" /> Sign up with facebook
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
