
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  CheckCircle, 
  Info,
  X
} from 'lucide-react';
import { Web3State } from '@/types';
import { toast } from '@/hooks/use-toast';

interface SubscriptionBannerProps {
  web3State: Web3State;
  onClose?: () => void;
}

const SubscriptionBanner = ({ web3State, onClose }: SubscriptionBannerProps) => {
  const [showBanner, setShowBanner] = useState(true);
  
  const handleDismiss = () => {
    setShowBanner(false);
    if (onClose) onClose();
    
    // Store in local storage to remember user preference
    localStorage.setItem('subscription_banner_closed', 'true');
  };
  
  useEffect(() => {
    // Check if user previously dismissed the banner
    const isClosed = localStorage.getItem('subscription_banner_closed') === 'true';
    setShowBanner(!isClosed);
  }, []);
  
  if (!showBanner || web3State.hasTokens) return null;
  
  return (
    <Card className="relative overflow-hidden border-primary/20 mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-crypto-blue/10 to-crypto-purple/10" />
      
      <div className="relative p-4 md:p-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2" 
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Crown className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h3 className="font-bold text-lg">Unlock Unlimited Analyses</h3>
              <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                Pro Feature
              </Badge>
            </div>
            
            <p className="text-muted-foreground text-sm mb-3">
              Get unlimited influencer reports by holding 1000 $WEB3D tokens in your wallet
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
              <div className="flex items-center text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                <span>Unlimited reports</span>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                <span>Enhanced analytics</span>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                <span>Priority processing</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Button 
              className="bg-crypto-gradient hover:opacity-90"
              onClick={() => {
                toast({
                  title: "Purchase tokens",
                  description: "This would redirect to a token purchase page in a real app",
                });
              }}
            >
              Get Tokens
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionBanner;
