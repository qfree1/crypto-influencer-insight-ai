
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RiskReport } from '@/types';
import { Users, BarChart, X, Check } from 'lucide-react';

interface RiskSummaryProps {
  summary: string;
  detailedAnalysis: string;
  twitterMetrics: RiskReport['twitterMetrics'];
}

const RiskSummary = ({ summary, detailedAnalysis, twitterMetrics }: RiskSummaryProps) => {
  // Calculate statistics
  const rugPullCount = twitterMetrics.promotedTokens.filter(t => t.status === 'rugpull').length;
  const activeCount = twitterMetrics.promotedTokens.filter(t => t.status === 'active').length;

  return (
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
  );
};

// Helper Component
const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-muted p-3 rounded-lg flex flex-col items-center space-y-2">
    {icon}
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

export default RiskSummary;
