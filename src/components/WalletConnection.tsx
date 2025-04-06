
import { useState, useEffect } from 'react';
import { setupWalletListeners } from '@/services/walletService';
import { Card } from '@/components/ui/card';
import { Wallet, AlertCircle, Shield, Check } from 'lucide-react';
import { Web3State } from '@/types';
import { toast } from '@/hooks/use-toast';
import WalletSelector from './WalletSelector';

interface WalletConnectionProps {
  web3State: Web3State;
  setWeb3State: (state: Web3State) => void;
}

const WalletConnection = ({ web3State, setWeb3State }: WalletConnectionProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showMetaMaskHelp, setShowMetaMaskHelp] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Check if any Web3 provider is installed
    const hasWeb3Provider = !!window.ethereum;
    setShowMetaMaskHelp(!hasWeb3Provider);
    
    // Set up listeners for account changes
    setupWalletListeners((newState) => {
      setWeb3State({ ...web3State, ...newState });
    });
  }, []);

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

        <WalletSelector 
          web3State={web3State} 
          setWeb3State={setWeb3State}
          isConnecting={isConnecting}
          setIsConnecting={setIsConnecting}
        />
        
        {showMetaMaskHelp && (
          <div className="bg-muted p-4 rounded-lg flex items-start gap-3 animate-fade-in">
            <AlertCircle className="text-yellow-500 w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm">
                No Web3 wallet detected. Please install a wallet to use this application.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-block"
                >
                  Download MetaMask
                </a>
                <a 
                  href="https://trustwallet.com/download" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-block"
                >
                  Download Trust Wallet
                </a>
              </div>
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
