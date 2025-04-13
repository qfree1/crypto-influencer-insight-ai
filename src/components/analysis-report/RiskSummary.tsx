
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RiskReport } from '@/types';
import { Users, BarChart, X, Check, AlertTriangle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RiskSummaryProps {
  summary: string;
  detailedAnalysis: string;
  twitterMetrics: RiskReport['twitterMetrics'];
}

const RiskSummary = ({ summary, detailedAnalysis, twitterMetrics }: RiskSummaryProps) => {
  // Calculate statistics
  const rugPullCount = twitterMetrics.promotedTokens.filter(t => t.status === 'rugpull').length;
  const activeCount = twitterMetrics.promotedTokens.filter(t => t.status === 'active').length;
  const isAiGenerated = summary.length > 100; // Heuristic to check if it's real OpenAI data vs fallback

  return (
    <Card className="crypto-card">
      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Risk Assessment</h3>
            {isAiGenerated ? (
              <Badge variant="outline" className="bg-primary/10 text-xs flex items-center gap-1">
                <Shield className="w-3 h-3" /> AI Analysis
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-muted/50 text-xs flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Basic Analysis
              </Badge>
            )}
          </div>
          <p className="text-lg leading-relaxed">{summary}</p>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Detailed Analysis</h3>
          <div className="bg-muted/30 p-4 rounded-md">
            <p className="leading-relaxed whitespace-pre-line">{detailedAnalysis}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <StatCard 
            icon={<Users className="w-5 h-5" />}
            label="Real Followers"
            value={`${twitterMetrics.realFollowerPercentage}%`}
            description={`Out of ${twitterMetrics.followers.toLocaleString()} total`}
          />
          <StatCard 
            icon={<BarChart className="w-5 h-5" />}
            label="Engagement"
            value={`${twitterMetrics.engagementRate}%`}
            description={twitterMetrics.engagementRate > 3 ? "Above average" : "Below average"}
          />
          <StatCard 
            icon={<X className="w-5 h-5 text-red-500" />}
            label="Rug Pulls"
            value={rugPullCount.toString()}
            description={`Failed promotions`}
          />
          <StatCard 
            icon={<Check className="w-5 h-5 text-green-500" />}
            label="Active Projects"
            value={activeCount.toString()}
            description={`Successful promotions`}
          />
        </div>
      </div>
    </Card>
  );
};

// Helper Component
const StatCard = ({ 
  icon, 
  label, 
  value, 
  description 
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  description?: string 
}) => (
  <div className="bg-muted p-3 rounded-lg flex flex-col items-center space-y-2">
    {icon}
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="font-bold">{value}</span>
    {description && <span className="text-xs text-muted-foreground text-center">{description}</span>}
  </div>
);

export default RiskSummary;
