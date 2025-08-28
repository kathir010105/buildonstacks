import { useEffect, useMemo, useState } from 'react';
import { AppConfig, UserSession, showConnect, disconnect, getStxAddress } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });
const network = new StacksTestnet();

export function useStacksAuth() {
  const [isSignedIn, setIsSignedIn] = useState(userSession.isUserSignedIn());
  const [userData, setUserData] = useState(isSignedIn ? userSession.loadUserData() : null);

  useEffect(() => {
    if (!isSignedIn && userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(data => {
        setUserData(data);
        setIsSignedIn(true);
      });
    }
  }, [isSignedIn]);

  const stxAddresses = useMemo(() => {
    try {
      if (!userData) return null;
      const addr = getStxAddress(userData.profile.stxAddress, network);
      return { testnet: addr }; // minimal for testnet
    } catch {
      return null;
    }
  }, [userData]);

  const signIn = () => {
    showConnect({
      userSession,
      network,
      appDetails: { name: 'Micro-Pension', icon: 'https://via.placeholder.com/32x32' },
      onFinish: () => {
        window.location.reload();
      },
    });
  };

  const signOut = () => {
    disconnect({ userSession });
    setIsSignedIn(false);
    setUserData(null);
  };

  return { userSession, isSignedIn, userData, stxAddresses, signIn, signOut };
}
