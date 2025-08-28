import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Connect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppConfig, UserSession } from '@stacks/connect';

// Components
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Enroll from './components/Enroll';
import Contribute from './components/Contribute';
import Claim from './components/Claim';
import Plans from './components/Plans';

// Styles
import './App.css';

// Create query client for data fetching
const queryClient = new QueryClient();

// Auth configuration for Stacks Connect
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const authOptions = {
  appDetails: {
    name: 'Micro-Pension',
    icon: 'https://via.placeholder.com/32x32',
  },
  redirectTo: '/',
  onFinish: () => {
    window.location.reload();
  },
  userSession,
  network: new StacksTestnet(),
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Connect authOptions={authOptions}>
        <Router>
          <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/enroll" element={<Enroll />} />
                <Route path="/contribute" element={<Contribute />} />
                <Route path="/claim" element={<Claim />} />
                <Route path="/plans" element={<Plans />} />
              </Routes>
            </main>
          </div>
        </Router>
      </Connect>
    </QueryClientProvider>
  );
}

export default App;
