import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, AlertCircle, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { WalletProvider, connectToWallet, getAvailableWalletProviders } from '@/services/wallet';
import { Web3State } from '@/types';
import { toast } from '@/hooks/use-toast';

interface WalletSelectorProps {
  web3State: Web3State;
  setWeb3State: (state: Web3State) => void;
  isConnecting: boolean;
  setIsConnecting: (isConnecting: boolean) => void;
}

const WalletSelector = ({ web3State, setWeb3State, isConnecting, setIsConnecting }: WalletSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const wallets = getAvailableWalletProviders();

  const handleConnectWallet = async (provider: WalletProvider) => {
    setIsConnecting(true);
    try {
      const state = await connectToWallet(provider);
      setWeb3State(state);
      
      if (state.isConnected) {
        toast({
          title: "Wallet Connected",
          description: `Connected to ${state.address?.substring(0, 6)}...${state.address?.substring(38)}`,
        });
        setIsOpen(false);
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-crypto-gradient hover:opacity-90 transition-all duration-300 py-6 h-auto text-lg relative overflow-hidden group"
          disabled={isConnecting}
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          <span className="relative flex items-center gap-2">
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            <Wallet className="h-5 w-5" />
          </span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-background/70 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gradient">Connect Your Wallet</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center mb-4">
          <img 
            src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png" 
            alt="Web3D Logo" 
            className="w-16 h-16 circle-glow animate-pulse-subtle" 
          />
        </div>
        
        <Tabs defaultValue="desktop" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="desktop" disabled={isMobile}>Desktop</TabsTrigger>
            <TabsTrigger value="mobile" disabled={!isMobile}>Mobile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="desktop" className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              {wallets.map((wallet) => (
                <Card 
                  key={wallet.name}
                  className="p-4 flex flex-col items-center justify-center space-y-3 hover:border-primary/50 transition-all cursor-pointer bg-card/70 backdrop-blur-sm"
                  onClick={() => handleConnectWallet(wallet.provider)}
                >
                  <img src={wallet.icon} alt={wallet.name} className="w-20 h-20 object-contain" />
                  <p className="text-sm font-medium">{wallet.name}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mobile" className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              {wallets
                .filter(wallet => wallet.isMobileSupported)
                .map((wallet) => (
                  <Card 
                    key={wallet.name}
                    className="p-4 flex flex-col items-center justify-center space-y-3 hover:border-primary/50 transition-all cursor-pointer bg-card/70 backdrop-blur-sm"
                    onClick={() => handleConnectWallet(wallet.provider)}
                  >
                    <img src={wallet.icon} alt={wallet.name} className="w-20 h-20 object-contain" />
                    <p className="text-sm font-medium">{wallet.name}</p>
                  </Card>
                ))
              }
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-start mt-4 gap-2 p-3 bg-muted/30 rounded-md">
          <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p>Don't have a wallet yet?</p>
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>Get MetaMask</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletSelector;
