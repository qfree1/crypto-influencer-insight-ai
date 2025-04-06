
import { useState, useEffect } from 'react';
import { connectWallet, setupWeb3Listeners } from '@/services/web3Service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, AlertCircle, Shield, Check } from 'lucide-react';
import { Web3State } from '@/types';
import { toast } from '@/hooks/use-toast';

interface WalletConnectionProps {
  web3State: Web3State;
  setWeb3State: (state: Web3State) => void;
}

const WalletConnection = ({ web3State, setWeb3State }: WalletConnectionProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showMetaMaskHelp, setShowMetaMaskHelp] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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
          title: "Account Connected",
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
    <Card className="crypto-card w-full max-w-md mx-auto relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-crypto-gradient rounded-full filter blur-xl animate-pulse-subtle"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full filter blur-xl animate-pulse-subtle" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="flex flex-col items-center p-6 space-y-6 relative z-10">
        <div 
          className={`w-20 h-20 rounded-full bg-muted flex items-center justify-center transition-all duration-500 ${isHovering ? 'scale-110 bg-crypto-gradient' : ''}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Wallet className={`w-10 h-10 transition-all duration-500 ${isHovering ? 'text-white animate-pulse' : 'text-primary'}`} />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gradient">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your Web3 wallet to verify token ownership and access influencer analysis.
          </p>
        </div>

        <div className="w-full space-y-3 py-2">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Check className="text-green-500 w-5 h-5" />
            <div className="text-sm">Secure connection</div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Shield className="text-primary w-5 h-5" />
            <div className="text-sm">Token verification</div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Wallet className="text-amber-500 w-5 h-5" />
            <div className="text-sm">One free analysis per wallet</div>
          </div>
        </div>

        <Button 
          className="w-full bg-crypto-gradient hover:opacity-90 transition-all duration-300 py-6 h-auto text-lg relative overflow-hidden group"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          <span className="relative">
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </span>
        </Button>
        
        {showMetaMaskHelp && (
          <div className="bg-muted p-4 rounded-lg flex items-start gap-3 animate-fade-in">
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
