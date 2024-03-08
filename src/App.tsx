//App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Pricing from './components/Pricing/Pricing';
import FAQs from './components/FAQs/FAQs';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { AuthProvider,useAuth } from './AuthContext';
import { useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { firebaseDatabase } from './utils/firebase-config';


function App() {
  const { currentUser } = useAuth(); 

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && currentUser) { 
      const statsRef = ref(firebaseDatabase, `users/${currentUser.uid}/links/${hash}`);
      onValue(statsRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.originalLink) {
          window.location.href = data.originalLink;
        }
      });
    }
  }, [currentUser]);

  return (
    <AuthProvider>
    <Router>
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
    </Router>
    </AuthProvider>
  );
}

export default App;
