import { useState, useEffect } from 'react';
import { AppState, RiskReport, Web3State } from '@/types';
import { initialWeb3State, autoReconnectWallet } from '@/services/web3Service';
import { generateReport } from '@/services/aiService';
import WalletConnection from '@/components/WalletConnection';
import TokenGate from '@/components/TokenGate';
import InfluencerForm from '@/components/InfluencerForm';
import AnalysisReport from '@/components/analysis-report/AnalysisReport';
import ReportHistory from '@/components/ReportHistory';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import Web3DBackgroundLogo from '@/components/Web3DBackgroundLogo';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { saveAnalysisToHistory } from '@/services/storageService';

const Index = () => {
  const [appState, setAppState] = useState<AppState>(AppState.CONNECT_WALLET);
  const [web3State, setWeb3State] = useState<Web3State>(initialWeb3State);
  const [report, setReport] = useState<RiskReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoConnecting, setIsAutoConnecting] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const reconnect = async () => {
      try {
        const reconnectedState = await autoReconnectWallet();
        if (reconnectedState.isConnected) {
          setWeb3State(reconnectedState);
          setAppState(AppState.VERIFY_TOKENS);
        }
      } catch (error) {
        console.error('Error auto-reconnecting wallet:', error);
      } finally {
        setIsAutoConnecting(false);
      }
    };
    reconnect();
  }, []);

  const handleWalletVerification = () => {
    setAppState(AppState.VERIFY_TOKENS);
  };

  const handleTokenVerification = () => {
    setAppState(AppState.INPUT_HANDLE);
  };

  const handleInfluencerSubmit = async (handle: string, platform: string = 'x') => {
    setIsLoading(true);
    setAppState(AppState.LOADING_REPORT);
    try {
      const reportData = await generateReport(handle, platform);
      setReport(reportData);
      if (reportData && web3State.address) {
        saveAnalysisToHistory({
          influencer: handle,
          platform: platform,
          date: new Date().toISOString(),
          reportId: reportData.id || Date.now().toString()
        });
      }
      setAppState(AppState.SHOW_REPORT);
    } catch (error) {
      console.error('Error generating report:', error);
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

  useEffect(() => {
    if (web3State.isConnected && appState === AppState.CONNECT_WALLET) {
      handleWalletVerification();
    }
  }, [web3State.isConnected, appState]);

  if (isAutoConnecting) {
    return <div className="min-h-screen flex flex-col bg-background">
        <Web3DBackgroundLogo />
        
        <div className="container mx-auto px-4 py-8 flex items-center justify-center" style={{
        minHeight: 'calc(100vh - 100px)'
      }}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <img src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png" alt="Web3D Logo" className="w-16 h-16 animate-bounce" />
            <Loader className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Reconnecting wallet...</p>
          </div>
        </div>
      </div>;
  }

  return <div className="min-h-screen flex flex-col bg-background">
      <Web3DBackgroundLogo />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          
        </div>
        
        {appState === AppState.CONNECT_WALLET && <WalletConnection web3State={web3State} setWeb3State={setWeb3State} />}
        
        {appState === AppState.VERIFY_TOKENS && <TokenGate web3State={web3State} onContinue={handleTokenVerification} />}
        
        {appState === AppState.INPUT_HANDLE && <>
            <SubscriptionBanner web3State={web3State} />
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <InfluencerForm web3State={web3State} onSubmit={handleInfluencerSubmit} setWeb3State={setWeb3State} />
              </div>
              
              <div className="md:col-span-1">
                <ReportHistory onSelectReport={handleSelectHistoryReport} />
              </div>
            </div>
          </>}
        
        {appState === AppState.LOADING_REPORT && <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <img src="/lovable-uploads/cdb1d1dd-f192-4146-a926-a4904db9dd15.png" alt="Web3D Logo" className="w-16 h-16 animate-bounce" />
            <Loader className="w-12 h-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing influencer data...</p>
          </div>}
        
        {appState === AppState.SHOW_REPORT && report && <AnalysisReport report={report} onNewAnalysis={startNewAnalysis} />}
      </div>
    </div>;
};

export default Index;
