
import { useState, useEffect } from 'react';
import { AppState, RiskReport, Web3State } from '@/types';
import { initialWeb3State } from '@/services/web3Service';
import { generateReport } from '@/services/aiService';
import WalletConnection from '@/components/WalletConnection';
import TokenGate from '@/components/TokenGate';
import InfluencerForm from '@/components/InfluencerForm';
import AnalysisReport from '@/components/AnalysisReport';
import ReportHistory from '@/components/ReportHistory';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [appState, setAppState] = useState<AppState>(AppState.CONNECT_WALLET);
  const [web3State, setWeb3State] = useState<Web3State>(initialWeb3State);
  const [report, setReport] = useState<RiskReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleWalletVerification = () => {
    setAppState(AppState.VERIFY_TOKENS);
  };

  const handleTokenVerification = () => {
    setAppState(AppState.INPUT_HANDLE);
  };

  const handleInfluencerSubmit = async (handle: string) => {
    setIsLoading(true);
    setAppState(AppState.LOADING_REPORT);
    
    try {
      const reportData = await generateReport(handle);
      setReport(reportData);
      setAppState(AppState.SHOW_REPORT);
    } catch (error) {
      console.error('Error generating report:', error);
      // Return to form on error
      setAppState(AppState.INPUT_HANDLE);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewAnalysis = () => {
    setAppState(AppState.INPUT_HANDLE);
    setReport(null);
  };
  
  const handleSelectHistoryReport = (historicalReport: RiskReport) => {
    setReport(historicalReport);
    setAppState(AppState.SHOW_REPORT);
  };

  // Update app state when wallet connects
  useEffect(() => {
    if (web3State.isConnected && appState === AppState.CONNECT_WALLET) {
      handleWalletVerification();
    }
  }, [web3State.isConnected, appState]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 rounded-lg bg-crypto-gradient flex items-center justify-center">
              <img 
                src="/lovable-uploads/4207036d-b43e-4c52-b710-684edb26b137.png" 
                alt="Web3D Logo" 
                className="w-8 h-8 circle-glow"
              />
            </div>
            <div className={isMobile ? "hidden" : "block"}>
              <h1 className="font-bold text-xl text-gradient">Web3D Influencer Analysis</h1>
              <p className="text-xs text-muted-foreground">AI-powered blockchain risk analysis</p>
            </div>
          </div>
          
          {web3State.isConnected ? (
            <div className="flex items-center space-x-1 bg-muted px-3 py-1 rounded-full text-sm">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="font-mono">
                {web3State.address?.substring(0, 6)}...{web3State.address?.substring(38)}
              </span>
            </div>
          ) : (
            <Button 
              onClick={() => setAppState(AppState.CONNECT_WALLET)} 
              className="bg-crypto-gradient hover:opacity-90"
              size={isMobile ? "sm" : "default"}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {appState === AppState.CONNECT_WALLET && (
          <WalletConnection web3State={web3State} setWeb3State={setWeb3State} />
        )}
        
        {appState === AppState.VERIFY_TOKENS && (
          <TokenGate web3State={web3State} onContinue={handleTokenVerification} />
        )}
        
        {appState === AppState.INPUT_HANDLE && (
          <>
            <SubscriptionBanner web3State={web3State} />
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <InfluencerForm 
                  web3State={web3State} 
                  onSubmit={handleInfluencerSubmit} 
                  setWeb3State={setWeb3State}
                />
              </div>
              
              <div className="md:col-span-1">
                <ReportHistory onSelectReport={handleSelectHistoryReport} />
              </div>
            </div>
          </>
        )}
        
        {appState === AppState.LOADING_REPORT && (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <Loader className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing influencer data...</p>
          </div>
        )}
        
        {appState === AppState.SHOW_REPORT && report && (
          <AnalysisReport report={report} onNewAnalysis={startNewAnalysis} />
        )}
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Web3Decision &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
