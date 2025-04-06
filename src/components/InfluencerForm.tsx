
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, AlertCircle } from 'lucide-react';
import { Web3State } from '@/types';
import { markFreeReportUsed, payForReport } from '@/services/web3Service';

interface InfluencerFormProps {
  web3State: Web3State;
  onSubmit: (handle: string) => void;
  setWeb3State: (state: Web3State) => void;
}

const InfluencerForm = ({ web3State, onSubmit, setWeb3State }: InfluencerFormProps) => {
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const sanitizedHandle = handle.trim().replace(/^@/, '');
    if (!sanitizedHandle) {
      setError('Please enter a valid Twitter/X handle');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user needs to pay
      if (!web3State.hasTokens && !web3State.freeReportUsed) {
        // Use free report
        markFreeReportUsed(web3State.address || '');
        setWeb3State({
          ...web3State,
          freeReportUsed: true
        });
      } else if (web3State.hasTokens && web3State.freeReportUsed) {
        // Pay for report
        const success = await payForReport(web3State.address || '');
        if (!success) {
          setError('Payment failed. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      onSubmit(sanitizedHandle);
    } catch (error) {
      console.error('Error processing request:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // For demo purposes, add some example handles
  const exampleHandles = ['CryptoXKing', 'CryptoGem', 'TokenPump'];

  return (
    <Card className="crypto-card w-full max-w-md mx-auto">
      <div className="flex flex-col p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gradient">Analyze Influencer Credibility</h2>
          <p className="text-muted-foreground">
            Enter a Twitter/X handle to analyze their credibility and risk profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Enter Twitter/X handle (e.g. @CryptoExpert)"
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

          <Button 
            type="submit"
            className="w-full bg-crypto-gradient hover:opacity-90 transition-opacity"
            disabled={isSubmitting || !handle.trim()}
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
