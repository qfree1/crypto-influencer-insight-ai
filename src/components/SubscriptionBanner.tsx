
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  CheckCircle, 
  Info,
  X,
  Sparkles
} from 'lucide-react';
import { Web3State } from '@/types';
import { toast } from '@/hooks/use-toast';

interface SubscriptionBannerProps {
  web3State: Web3State;
  onClose?: () => void;
}

const SubscriptionBanner = ({ web3State, onClose }: SubscriptionBannerProps) => {
  const [showBanner, setShowBanner] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowBanner(false);
      if (onClose) onClose();
    }, 500);
    
    // Store in local storage to remember user preference
    localStorage.setItem('subscription_banner_closed', 'true');
  };
  
  useEffect(() => {
    // Check if user previously dismissed the banner
    const isClosed = localStorage.getItem('subscription_banner_closed') === 'true';
    setShowBanner(!isClosed);
    
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!showBanner || web3State.hasTokens) return null;
  
  return (
    <Card className={`relative overflow-hidden border-primary/20 mb-6 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-crypto-blue/10 to-crypto-purple/10">
        {/* Animated particles */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative p-4 md:p-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 hover:bg-white/10" 
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center relative">
              <Crown className="h-6 w-6 text-primary" />
              <Sparkles className="absolute top-0 right-0 h-4 w-4 text-crypto-cyan animate-pulse-subtle" />
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
              <div className="flex items-center text-xs text-muted-foreground bg-background px-2 py-1 rounded-full hover:bg-background/80 transition-colors">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                <span>Unlimited reports</span>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground bg-background px-2 py-1 rounded-full hover:bg-background/80 transition-colors">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                <span>Enhanced analytics</span>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground bg-background px-2 py-1 rounded-full hover:bg-background/80 transition-colors">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                <span>Priority processing</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Button 
              className="bg-crypto-gradient hover:opacity-90 group relative overflow-hidden"
              onClick={() => {
                toast({
                  title: "Purchase tokens",
                  description: "This would redirect to a token purchase page in a real app",
                });
              }}
            >
              <span className="relative z-10">Get Tokens</span>
              <span className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionBanner;
