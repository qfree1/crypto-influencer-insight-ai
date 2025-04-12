import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, XCircle, Coins } from 'lucide-react';
import { Web3State } from '@/types';
import { REQUIRED_TOKENS } from '@/services/web3Service';
interface TokenGateProps {
  web3State: Web3State;
  onContinue: () => void;
}
const TokenGate = ({
  web3State,
  onContinue
}: TokenGateProps) => {
  const [canContinue, setCanContinue] = useState(false);
  useEffect(() => {
    // User can continue if they have required tokens or haven't used free report
    setCanContinue(web3State.hasTokens || !web3State.freeReportUsed);
  }, [web3State]);
  return <Card className="crypto-card w-full max-w-md mx-auto">
      <div className="flex flex-col items-center p-6 space-y-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <img alt="Web3D Logo" className="w-16 h-16" src="/lovable-uploads/59668c94-5ffb-49fc-a860-c91a0b5fb8e1.png" />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gradient">Token Verification</h2>
          <p className="text-muted-foreground">
            {web3State.hasTokens ? "You have the required tokens! Full access granted." : "You don't have enough WEB3D tokens for unlimited access."}
          </p>
        </div>

        <div className="w-full space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-secondary">
            <span>WEB3D Balance:</span>
            <span className="font-mono font-bold">{web3State.tokenBalance}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 rounded-lg bg-secondary">
            <span>Required Tokens:</span>
            <span className="font-mono font-bold">{REQUIRED_TOKENS} $WEB3D</span>
          </div>
          
          <div className="flex justify-between items-center p-3 rounded-lg bg-secondary">
            <span>Free Report Available:</span>
            {!web3State.freeReportUsed ? <CheckCircle className="text-green-500 w-5 h-5" /> : <XCircle className="text-red-500 w-5 h-5" />}
          </div>
          
          <div className="flex justify-between items-center p-3 rounded-lg bg-secondary">
            <span>Cost Per Analysis:</span>
            <div className="flex items-center gap-1">
              <Coins className="text-primary w-4 h-4" />
              <span className="font-mono font-bold">1 $WEB3D</span>
            </div>
          </div>
        </div>

        <Button className="w-full bg-crypto-gradient hover:opacity-90 transition-opacity" onClick={onContinue} disabled={!canContinue}>
          {web3State.hasTokens ? "Continue to Analysis" : web3State.freeReportUsed ? "Insufficient Tokens" : "Use Free Report"}
        </Button>
        
        {!web3State.hasTokens && <p className="text-xs text-muted-foreground text-center">
            {web3State.freeReportUsed ? "You've used your free report. Each additional report costs 1 $WEB3D token." : "You can use your one-time free report or acquire WEB3D tokens for unlimited access at 1 $WEB3D token per report."}
          </p>}
      </div>
    </Card>;
};
export default TokenGate;