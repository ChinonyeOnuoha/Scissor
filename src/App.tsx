//App.tsx
import React from 'react';
import {Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Pricing from './components/Pricing/Pricing';
import FAQs from './components/FAQs/FAQs';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { firebaseDatabase } from './utils/firebase-config';



function App() {
  const { currentUser } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const redirectIfNeeded = async () => {
      const hash = location.hash.replace('#', '');
      if (hash && currentUser) {
        const statsRef = ref(firebaseDatabase, `users/${currentUser.uid}/links/${hash}`);
        const snapshot = await get(statsRef); 
        const data = snapshot.val();
        if (data && /^(ftp|http|https):\/\/[^ "]+$/.test(data.originalLink)) {
          window.location.href = data.originalLink;
        } else {
          navigate('/'); 
        }
      }
    };

    redirectIfNeeded();
  }, [currentUser, location.hash, navigate]);

  return (
    <>
      <Header /> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faqs" element={<FAQs />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
