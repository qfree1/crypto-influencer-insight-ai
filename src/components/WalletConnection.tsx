
import { useState, useEffect } from 'react';
import { connectWallet, setupWeb3Listeners } from '@/services/web3Service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, AlertCircle } from 'lucide-react';
import { Web3State } from '@/types';
import { toast } from '@/hooks/use-toast';

interface WalletConnectionProps {
  web3State: Web3State;
  setWeb3State: (state: Web3State) => void;
}

const WalletConnection = ({ web3State, setWeb3State }: WalletConnectionProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showMetaMaskHelp, setShowMetaMaskHelp] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    const hasMetaMask = !!window.ethereum;
    setShowMetaMaskHelp(!hasMetaMask);
    
    // Set up listeners for account changes
    setupWeb3Listeners((newState) => {
      setWeb3State({ ...web3State, ...newState });
      
      // Show toast when account changes
      if (newState.address && newState.address !== web3State.address) {
        toast({
          title: "Account Changed",
          description: `Connected to ${newState.address.substring(0, 6)}...${newState.address.substring(38)}`,
        });
      }
    });
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const state = await connectWallet();
      setWeb3State(state);
      
      if (!state.isConnected) {
        setShowMetaMaskHelp(true);
      }
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
        
        {showMetaMaskHelp && (
          <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-yellow-500 w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm">
                MetaMask or compatible wallet extension not detected. Please install MetaMask to use this application.
              </p>
              <a 
                href="https://metamask.io/download/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline mt-2 inline-block"
              >
                Download MetaMask
              </a>
            </div>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground text-center">
          You need to hold 1000 $WEB3D tokens to access all features.
          Each wallet gets one free analysis.
        </p>
      </div>
    </Card>
  );
};

export default WalletConnection;
