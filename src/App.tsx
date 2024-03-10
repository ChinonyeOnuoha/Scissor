//App.tsx
import React, { Suspense, lazy, useEffect } from 'react';
import {Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Pricing from './components/Pricing/Pricing';
import FAQs from './components/FAQs/FAQs';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PageNotFound from './pages/PageNotFound';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { ref, get } from 'firebase/database';
import { firebaseDatabase } from './utils/firebase-config';


// Lazy-loaded components
const HomePage = lazy(() => import('./pages/HomePage'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const Login = lazy(() => import('./components/Login/Login'));
const Signup = lazy(() => import('./components/Signup/Signup'));

function App() {
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const redirectIfNeeded = async () => {
      const hash = location.hash.replace('#', '');
      if (hash) {
        const linkRef = ref(firebaseDatabase, `publicLinks/${hash}`);
        const snapshot = await get(linkRef);
        const data = snapshot.val();
        if (data && /^(ftp|http|https):\/\/[^ "]+$/.test(data.originalLink)) {
          window.location.href = data.originalLink;
        } else {
          navigate('/'); 
        }
      }
    };
  
    redirectIfNeeded();
  }, [location.hash, navigate]);
  

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="*" element={< PageNotFound />} />
        </Routes>
        <Footer />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
