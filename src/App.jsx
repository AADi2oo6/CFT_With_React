import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import QuotesSection from './components/QuotesSection';
import EmissionsMap from './components/EmissionsMap';
import ImpactSection from './components/ImpactSection';
import CommunityImpactMap from './components/CommunityImpactMap';
import EcoChampions from './components/EcoChampions';
import LiveActions from './components/LiveActions';
import ActionableInsights from './components/ActionableInsights';
import EmissionBreakdown from './components/EmissionBreakdown';
import CountryComparison from './components/CountryComparison';
import FloatingNav from './components/FloatingNav';
import './App.css'

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pt-16">
      <Header onLoginClick={openLogin} onRegisterClick={openRegister} />

      <FloatingNav />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      <main className="flex-grow">
        <div id="welcome"><QuotesSection /></div>
        <div id="global-emissions"><EmissionsMap /></div>
        <div id="community-stats"><ImpactSection /></div>
        <div id="heatmap"><CommunityImpactMap /></div>
        <div id="leaderboard"><EcoChampions /></div>
        <div id="live-feed"><LiveActions /></div>
        <div id="insights"><ActionableInsights /></div>
        <div id="breakdown"><EmissionBreakdown /></div>
        <div id="comparison"><CountryComparison /></div>
      </main>
      <Footer />
    </div>
  )
}

export default App
