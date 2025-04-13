
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, AlertCircle, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { Web3State } from '@/types';
import { markFreeReportUsed, payForReport } from '@/services/web3Service';
import { toast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface InfluencerFormProps {
  web3State: Web3State;
  onSubmit: (handle: string, platform: string) => void;
  setWeb3State: (state: Web3State) => void;
}

const InfluencerForm = ({ web3State, onSubmit, setWeb3State }: InfluencerFormProps) => {
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [platform, setPlatform] = useState('x');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const sanitizedHandle = handle.trim().replace(/^@/, '');
    if (!sanitizedHandle) {
      setError(`Please enter a valid ${getPlatformName(platform)} handle`);
      return;
    }

    setIsSubmitting(true);
    toast({
      title: "Analyzing Influencer",
      description: `Starting analysis for @${sanitizedHandle} on ${getPlatformName(platform)}...`,
    });

    try {
      // Check if user needs to pay
      if (!web3State.hasTokens && !web3State.freeReportUsed) {
        // Use free report
        markFreeReportUsed(web3State.address || '');
        setWeb3State({
          ...web3State,
          freeReportUsed: true
        });
        toast({
          title: "Free Analysis Used",
          description: "You've used your one-time free analysis",
        });
      } else if (web3State.freeReportUsed && !web3State.hasTokens) {
        setError('You need WEB3D tokens for additional reports');
        setIsSubmitting(false);
        return;
      } else if (web3State.freeReportUsed) {
        // Pay for report with 1 token
        const success = await payForReport(web3State.address || '');
        if (!success) {
          setError('Payment failed. Please try again.');
          setIsSubmitting(false);
          return;
        }
        
        toast({
          title: "Payment Successful",
          description: "Payment processed successfully",
        });
      }

      onSubmit(sanitizedHandle, platform);
    } catch (error) {
      console.error('Error processing request:', error);
      setError('An error occurred. Please try again.');
      toast({
        title: "Error",
        description: "An error occurred while processing your request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlatformName = (platformId: string): string => {
    switch(platformId) {
      case 'x': return 'Twitter/X';
      case 'instagram': return 'Instagram';
      case 'telegram': return 'Telegram';
      default: return 'Social Media';
    }
  };

  const getPlatformIcon = (platformId: string) => {
    switch(platformId) {
      case 'x': return <Twitter className="h-4 w-4" />;
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'telegram': return <MessageCircle className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  // Real influencer examples by platform
  const getExampleHandles = () => {
    switch(platform) {
      case 'x':
        return ['VitalikButerin', 'SBF_FTX', 'cz_binance'];
      case 'instagram':
        return ['crypto_nate', 'blockchain_daily', 'cryptodad'];
      case 'telegram':
        return ['cryptosignals', 'bitcoinchats', 'altcoinreports'];
      default:
        return ['VitalikButerin', 'SBF_FTX', 'cz_binance'];
    }
  };

  const exampleHandles = getExampleHandles();

  return (
    <Card className="crypto-card w-full mx-auto">
      <div className="flex flex-col p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-2">
            <img 
              src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png" 
              alt="Web3D Logo" 
              className="w-10 h-10 mr-2" 
            />
            <h2 className="text-2xl font-bold text-gradient">Analyze Influencer Credibility</h2>
          </div>
          <p className="text-muted-foreground">
            Select a platform and enter a handle to analyze their credibility and risk profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Platform</label>
            <RadioGroup 
              defaultValue="x" 
              value={platform} 
              onValueChange={setPlatform}
              className="grid grid-cols-3 gap-2"
            >
              <div className="flex items-center space-x-2 border rounded-md p-2 hover:bg-muted/30">
                <RadioGroupItem value="x" id="x" />
                <Label htmlFor="x" className="flex items-center cursor-pointer">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter/X
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-2 hover:bg-muted/30">
                <RadioGroupItem value="instagram" id="instagram" />
                <Label htmlFor="instagram" className="flex items-center cursor-pointer">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-2 hover:bg-muted/30">
                <RadioGroupItem value="telegram" id="telegram" />
                <Label htmlFor="telegram" className="flex items-center cursor-pointer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Telegram
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              {getPlatformIcon(platform)}
            </div>
            <Input
              type="text"
              placeholder={`Enter ${getPlatformName(platform)} handle (e.g. @${exampleHandles[0]})`}
              value={handle}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 rounded-lg bg-muted/40 text-sm flex items-center gap-2">
            <img 
              src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png" 
              alt="Web3D Logo" 
              className="h-4 w-4 text-primary" 
            />
            {!web3State.freeReportUsed ? (
              <span>You have 1 free analysis available</span>
            ) : web3State.hasTokens ? (
              <span>Analysis cost: 1 $WEB3D</span>
            ) : (
              <span className="text-destructive">Insufficient tokens. Need 1 $WEB3D token for analysis</span>
            )}
          </div>

          <Button 
            type="submit"
            className="w-full bg-crypto-gradient hover:opacity-90 transition-opacity"
            disabled={isSubmitting || !handle.trim() || (web3State.freeReportUsed && !web3State.hasTokens)}
          >
            {isSubmitting ? 'Analyzing...' : 'Analyze Influencer'}
          </Button>
        </form>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleHandles.map((exampleHandle) => (
              <Button
                key={exampleHandle}
                variant="outline"
                size="sm"
                onClick={() => setHandle(exampleHandle)}
                className="text-xs"
              >
                @{exampleHandle}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InfluencerForm;
