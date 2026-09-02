import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import GiveawayPage from './pages/Giveaway/GiveawayPage';
import GiveawayDetailPage from './pages/GiveawayDetail/GiveawayDetailPage';

export default function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GiveawayPage />} />
            <Route path="/giveaway/:slug" element={<GiveawayDetailPage />} />
            {/* Fallback */}
            <Route path="*" element={<GiveawayPage />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ErrorBoundary>
  );
}
