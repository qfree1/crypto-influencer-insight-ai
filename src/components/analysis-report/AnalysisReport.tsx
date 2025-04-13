
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskReport } from '@/types';
import { FileText, BarChart, Coins } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { saveReportToHistory } from '@/services/aiService';

import ReportHeader from './ReportHeader';
import RiskSummary from './RiskSummary';
import MetricsTab from './MetricsTab';
import BlockchainDetails from '../BlockchainDetails';
import EnhancedShareButtons from '../EnhancedShareButtons';
import AnalysisNav from './AnalysisNav';

interface AnalysisReportProps {
  report: RiskReport;
  onNewAnalysis: () => void;
}

const AnalysisReport = ({ report, onNewAnalysis }: AnalysisReportProps) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isSaved, setIsSaved] = useState(false);
  
  // Get platform display name
  const getPlatformName = (platform?: string): string => {
    if (!platform) return 'Twitter/X';
    switch(platform) {
      case 'x': return 'Twitter/X';
      case 'instagram': return 'Instagram';
      case 'telegram': return 'Telegram';
      default: return 'Social Media';
    }
  };
  
  // Save report to history
  const handleSaveReport = () => {
    saveReportToHistory(report);
    setIsSaved(true);
    toast({
      title: "Report saved",
      description: "This report has been saved to your history",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <ReportHeader 
        influencerData={report.influencerData}
        riskScore={report.riskScore}
        timestamp={report.timestamp}
        onSaveReport={handleSaveReport}
        isSaved={isSaved}
        platform={report.platform}
      />
      
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full bg-muted grid grid-cols-3">
          <TabsTrigger value="summary" className="text-sm md:text-base">
            <FileText className="w-4 h-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="metrics" className="text-sm md:text-base">
            <BarChart className="w-4 h-4 mr-2" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="text-sm md:text-base">
            <Coins className="w-4 h-4 mr-2" />
            Blockchain
          </TabsTrigger>
        </TabsList>
        
        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <RiskSummary 
            summary={report.summary}
            detailedAnalysis={report.detailedAnalysis}
            twitterMetrics={report.twitterMetrics}
            platform={report.platform}
          />
          
          <EnhancedShareButtons report={report} />
        </TabsContent>
        
        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <MetricsTab twitterMetrics={report.twitterMetrics} platform={report.platform} />
        </TabsContent>
        
        {/* Blockchain Tab */}
        <TabsContent value="blockchain" className="space-y-4">
          <BlockchainDetails data={report.blockchainData} />
        </TabsContent>
      </Tabs>

      <AnalysisNav onNewAnalysis={onNewAnalysis} />
    </div>
  );
};

export default AnalysisReport;
