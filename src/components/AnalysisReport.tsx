
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskReport } from '@/types';
import RiskScore from './RiskScore';
import EnhancedShareButtons from './EnhancedShareButtons';
import BlockchainDetails from './BlockchainDetails';
import { 
  Users, 
  BarChart, 
  Coins, 
  FileText, 
  Check, 
  X, 
  TrendingDown,
  Bookmark,
  BookmarkPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { saveReportToHistory } from '@/services/aiService';

interface AnalysisReportProps {
  report: RiskReport;
  onNewAnalysis: () => void;
}

const AnalysisReport = ({ report, onNewAnalysis }: AnalysisReportProps) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isSaved, setIsSaved] = useState(false);
  
  const { 
    influencerData, 
    twitterMetrics, 
    blockchainData, 
    riskScore, 
    summary, 
    detailedAnalysis 
  } = report;

  // Calculate statistics
  const rugPullCount = twitterMetrics.promotedTokens.filter(t => t.status === 'rugpull').length;
  const activeCount = twitterMetrics.promotedTokens.filter(t => t.status === 'active').length;
  const declinedCount = twitterMetrics.promotedTokens.filter(t => t.status === 'declined').length;

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      <Card className="crypto-card">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <img 
                src={influencerData.profileImage || 'https://placehold.co/100x100/1E40AF/FFFFFF/?text=??'} 
                alt={influencerData.handle}
                className="w-24 h-24 rounded-lg object-cover glow"
              />
            </div>
            
            <div className="flex-grow space-y-2">
              <h1 className="text-3xl font-bold">@{influencerData.handle}</h1>
              {influencerData.name && (
                <h2 className="text-xl text-muted-foreground">{influencerData.name}</h2>
              )}
              <div className="text-sm text-muted-foreground">
                Analysis generated on {formatDate(report.timestamp)}
              </div>
              
              <div className="flex items-center space-x-2 pt-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-1"
                  onClick={handleSaveReport}
                  disabled={isSaved}
                >
                  {isSaved ? (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" />
                      <span>Save Report</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <RiskScore score={riskScore} size="lg" />
            </div>
          </div>
        </div>
      </Card>
      
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
          <Card className="crypto-card">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Risk Assessment</h3>
                <p className="text-lg">{summary}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Detailed Analysis</h3>
                <p>{detailedAnalysis}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <StatCard 
                  icon={<Users className="w-5 h-5" />}
                  label="Real Followers"
                  value={`${twitterMetrics.realFollowerPercentage}%`}
                />
                <StatCard 
                  icon={<BarChart className="w-5 h-5" />}
                  label="Engagement"
                  value={`${twitterMetrics.engagementRate}%`}
                />
                <StatCard 
                  icon={<X className="w-5 h-5 text-red-500" />}
                  label="Rug Pulls"
                  value={rugPullCount.toString()}
                />
                <StatCard 
                  icon={<Check className="w-5 h-5 text-green-500" />}
                  label="Active Projects"
                  value={activeCount.toString()}
                />
              </div>
            </div>
          </Card>
          
          <EnhancedShareButtons report={report} />
        </TabsContent>
        
        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <Card className="crypto-card">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Social Media Metrics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <MetricItem 
                      label="Total Followers" 
                      value={twitterMetrics.followers.toLocaleString()} 
                    />
                    <MetricItem 
                      label="Real Followers" 
                      value={`${twitterMetrics.realFollowerPercentage}%`} 
                      description="Estimated percentage of authentic accounts"
                    />
                    <MetricItem 
                      label="Engagement Rate" 
                      value={`${twitterMetrics.engagementRate}%`} 
                      description="Average engagement per post relative to follower count"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Follower Authenticity</h4>
                    <div className="h-6 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary"
                        style={{ width: `${twitterMetrics.realFollowerPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bot/Inactive</span>
                      <span className="text-muted-foreground">Authentic</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Promoted Tokens</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-border">
                        <th className="pb-2 font-medium">Token</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {twitterMetrics.promotedTokens.map((token, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-3 font-medium">{token.name}</td>
                          <td>
                            <StatusBadge status={token.status} />
                          </td>
                          <td className={`
                            ${token.performancePercentage > 0 ? 'text-green-500' : 'text-red-500'}
                          `}>
                            {token.performancePercentage > 0 ? '+' : ''}
                            {token.performancePercentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Blockchain Tab */}
        <TabsContent value="blockchain" className="space-y-4">
          <BlockchainDetails data={blockchainData} />
        </TabsContent>
      </Tabs>

      <Card className="crypto-card p-6">
        <button 
          onClick={onNewAnalysis}
          className="w-full py-3 px-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
        >
          Analyze Another Influencer
        </button>
      </Card>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-muted p-3 rounded-lg flex flex-col items-center space-y-2">
    {icon}
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

const MetricItem = ({ label, value, description }: { label: string, value: string, description?: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
    {description && <p className="text-xs text-muted-foreground">{description}</p>}
  </div>
);

const StatusBadge = ({ status }: { status: 'rugpull' | 'active' | 'declined' }) => {
  const styles = {
    rugpull: 'bg-red-900/30 text-red-500',
    active: 'bg-green-900/30 text-green-500',
    declined: 'bg-yellow-900/30 text-yellow-500',
  };
  
  const labels = {
    rugpull: 'Rug Pull',
    active: 'Active',
    declined: 'Declined',
  };
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default AnalysisReport;
