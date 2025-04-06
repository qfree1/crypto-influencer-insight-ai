
import { useState, useEffect } from 'react';
import { connectWallet, setupWeb3Listeners } from '@/services/web3Service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { Web3State } from '@/types';

interface WalletConnectionProps {
  web3State: Web3State;
  setWeb3State: (state: Web3State) => void;
}

const WalletConnection = ({ web3State, setWeb3State }: WalletConnectionProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Set up listeners for account changes
    setupWeb3Listeners((newState) => {
      setWeb3State({ ...web3State, ...newState });
    });
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const state = await connectWallet();
      setWeb3State(state);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="crypto-card w-full max-w-md mx-auto">
      <div className="flex flex-col items-center p-6 space-y-6">
        <div className="w-20 h-20 rounded-full bg-crypto-gradient flex items-center justify-center animate-pulse-subtle">
          <Wallet className="text-white w-10 h-10" />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gradient">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your Web3 wallet to verify token ownership and access influencer analysis.
          </p>
        </div>

        <Button 
          className="w-full bg-crypto-gradient hover:opacity-90 transition-opacity"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          You need to hold 1000 $WEB3D tokens to access all features.
          Each wallet gets one free analysis.
        </p>
      </div>
    </Card>
  );
};

export default WalletConnection;
